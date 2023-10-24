import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gql from "graphql-tag";

import { parseEmail, parseNames, toToken } from "../utils/parser";
import {
  resendVerificationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/mailer";
import { Resolvers } from "../__generated__/resolvers-types";
import { Token, TokenType } from "../types";
import { getUser, handleTokenError } from "../utils/userHelper";
import User from "../models/user";
import config from "../utils/config";

export const typeDef = gql`
  type User {
    id: ID!
    email: String!
    passwordHash: String!
    firstName: String!
    lastName: String!
    verified: Boolean!
    latestPasswordChange: Date!
  }

  extend type Query {
    getPasswordReset(token: String!): User
    me: User
  }

  extend type Mutation {
    createUser(
      email: String!
      password: String!
      confirmPassword: String!
      firstName: String!
      lastName: String!
      verified: Boolean
    ): User
    verifyUser(token: String!): User
    resendVerification(token: String!): User
    createPasswordReset(email: String!): User
    updateUser(
      token: String!
      password: String!
      confirmPassword: String!
    ): User
  }
`;

export const resolvers: Resolvers = {
  Query: {
    getPasswordReset: async (_root, { token }) => {
      let decodedToken, passwordResetToken;

      try {
        decodedToken = jwt.verify(token, config.SECRET);
        passwordResetToken = toToken(decodedToken);
      } catch (error: unknown) {
        const tokenError = await handleTokenError(
          error,
          token,
          TokenType.Password,
          false
        );
        throw tokenError;
      }

      if (passwordResetToken.type !== TokenType.Password) {
        throw new GraphQLError("Invalid password reset link", {
          extensions: {
            code: "INVALID_TOKEN",
            invalidArgs: token,
          },
        });
      }

      const user = await getUser(
        passwordResetToken,
        "No account found with this email",
        false
      );

      if (
        Date.now() - user.latestPasswordChange.getTime() <
        24 * 60 * 60 * 1000
      ) {
        throw new GraphQLError(
          "Can not set a new password for 24 hours after most recent change",
          {
            extensions: {
              code: "EARLY_PASSWORD_RESET",
              invalidArgs: token,
            },
          }
        );
      }

      return user;
    },
    me: (_root, _args, { currentUser }) => {
      return currentUser ?? null;
    },
  },
  Mutation: {
    createUser: async (
      _root,
      { email, password, confirmPassword, firstName, lastName, verified },
      { clientOrigin }
    ) => {
      try {
        parseEmail(email);
        parseNames(firstName, lastName);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: email,
            },
          });
        }
      }

      if (password.length < 8) {
        throw new GraphQLError("Password must be least 8 characters long", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: password,
          },
        });
      }
      if (password !== confirmPassword) {
        throw new GraphQLError("Please enter the same password twice", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: {
              password,
              confirmPassword,
            },
          },
        });
      }

      const caseInsensitiveEmail = email.toLowerCase();
      const existingUser = await User.findOne({ email: caseInsensitiveEmail });

      if (existingUser) {
        throw new GraphQLError(
          "An account with this email address already exists",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: email,
            },
          }
        );
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = new User({
        email: caseInsensitiveEmail,
        passwordHash,
        firstName,
        lastName,
        verified: verified ?? false,
        latestPasswordChange: new Date(),
      });

      try {
        await user.save();

        const userForToken: Token = {
          email: user.email,
          id: user._id,
          type: TokenType.Verification,
        };
        const token = jwt.sign(userForToken, config.SECRET, {
          expiresIn: "1d",
        });

        await sendVerificationEmail(email, token, clientOrigin);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: {
                email,
                password,
                confirmPassword,
                firstName,
                lastName,
              },
              error,
            },
          });
        }
      }

      return user;
    },
    verifyUser: async (_root, { token }) => {
      let decodedToken, verificationToken;

      try {
        decodedToken = jwt.verify(token, config.SECRET);
        verificationToken = toToken(decodedToken);
      } catch (error: unknown) {
        const tokenError = await handleTokenError(
          error,
          token,
          TokenType.Verification,
          true
        );
        throw tokenError;
      }

      if (verificationToken.type !== TokenType.Verification) {
        throw new GraphQLError(
          "Verification failed - invalid verification link",
          {
            extensions: {
              code: "INVALID_TOKEN",
              invalidArgs: token,
            },
          }
        );
      }

      const user = await getUser(
        verificationToken,
        "Verification failed - no account found with this email",
        true
      );

      user.verified = true;

      try {
        await user.save();
      } catch (error: unknown) {
        throw new GraphQLError("Verification failed.", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }

      return user;
    },
    resendVerification: async (_root, { token }, { clientOrigin }) => {
      let decodedToken, verificationToken;

      try {
        decodedToken = jwt.verify(token, config.SECRET, {
          ignoreExpiration: true,
        });
        verificationToken = toToken(decodedToken);
      } catch (error: unknown) {
        throw new GraphQLError(
          "Failed to send new verification email - invalid verification link",
          {
            extensions: {
              code: "INVALID_TOKEN",
              invalidArgs: token,
              error,
            },
          }
        );
      }

      if (verificationToken.type !== TokenType.Verification) {
        throw new GraphQLError(
          "Failed to send new verification email - invalid verification link",
          {
            extensions: {
              code: "INVALID_TOKEN",
              invalidArgs: token,
            },
          }
        );
      }

      const user = await getUser(
        verificationToken,
        "Failed to send email - no account found with this email",
        true
      );
      const userForToken: Token = {
        email: user.email,
        id: user._id,
        type: TokenType.Verification,
      };
      const newToken = jwt.sign(userForToken, config.SECRET, {
        expiresIn: "1d",
      });

      try {
        await resendVerificationEmail(user.email, newToken, clientOrigin);
      } catch (error: unknown) {
        throw new GraphQLError("Failed to send verification email.", {
          extensions: {
            code: "EMAIL_FAILURE",
            error,
          },
        });
      }

      return user;
    },
    createPasswordReset: async (_root, { email }, { clientOrigin }) => {
      try {
        parseEmail(email);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: email,
            },
          });
        }
      }

      const caseInsensitiveEmail = email.toLowerCase();
      const user = await getUser(
        caseInsensitiveEmail,
        "Failed to send password reset email - no account found with this email",
        false
      );

      if (
        Date.now() - user.latestPasswordChange.getTime() <
        24 * 60 * 60 * 1000
      ) {
        throw new GraphQLError(
          "Can not set a new password for 24 hours after most recent change",
          {
            extensions: {
              code: "EARLY_PASSWORD_RESET",
              invalidArgs: email,
            },
          }
        );
      }

      const userForToken: Token = {
        email: user.email,
        id: user._id,
        type: TokenType.Password,
      };
      const token = jwt.sign(userForToken, config.SECRET, {
        expiresIn: "1d",
      });

      try {
        await sendPasswordResetEmail(email, token, clientOrigin);
      } catch (error: unknown) {
        throw new GraphQLError("Failed to send password reset email", {
          extensions: {
            code: "EMAIL_FAILURE",
            error,
          },
        });
      }

      return user;
    },
    updateUser: async (_root, { token, password, confirmPassword }) => {
      let decodedToken, passwordResetToken;

      try {
        decodedToken = jwt.verify(token, config.SECRET);
        passwordResetToken = toToken(decodedToken);
      } catch (error: unknown) {
        const tokenError = await handleTokenError(
          error,
          token,
          TokenType.Password,
          false
        );
        throw tokenError;
      }

      if (passwordResetToken.type !== TokenType.Password) {
        throw new GraphQLError("Invalid password reset link", {
          extensions: {
            code: "INVALID_TOKEN",
            invalidArgs: token,
          },
        });
      }

      const user = await getUser(
        passwordResetToken,
        "No account found with this email",
        false
      );

      if (
        Date.now() - user.latestPasswordChange.getTime() <
        24 * 60 * 60 * 1000
      ) {
        throw new GraphQLError(
          "Can not set a new password for 24 hours after most recent change",
          {
            extensions: {
              code: "EARLY_PASSWORD_RESET",
              invalidArgs: token,
            },
          }
        );
      }
      if (password.length < 8) {
        throw new GraphQLError("Password must be least 8 characters long", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: password,
          },
        });
      }
      if (password !== confirmPassword) {
        throw new GraphQLError("Please enter the same password twice", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: {
              password,
              confirmPassword,
            },
          },
        });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      user.passwordHash = passwordHash;
      user.latestPasswordChange = new Date();

      try {
        await user.save();
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError("Failed to set new password", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: {
                token,
                password,
                confirmPassword,
              },
              error,
            },
          });
        }
      }

      return user;
    },
  },
};
