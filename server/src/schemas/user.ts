import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';

import { parseEmail, toToken } from '../utils/parser';
import {
  resendVerificationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../utils/mailer';
import { Resolvers } from '../__generated__/resolvers-types';
import { Token, TokenType } from '../types';
import User from '../models/user';
import config from '../utils/config';

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
    verifyPasswordToken(token: String!): User
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    createUser: async (
      _root,
      { email, password, confirmPassword, firstName, lastName, verified }
    ) => {
      try {
        parseEmail(email);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: email,
            },
          });
        }
      }

      if (password.length < 8) {
        throw new GraphQLError('Password must be least 8 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: password,
          },
        });
      }

      if (password !== confirmPassword) {
        throw new GraphQLError('Please enter the same password twice', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: password,
          },
        });
      }

      const caseInsensitiveEmail = email.toLowerCase();

      const existingUser = await User.findOne({ email: caseInsensitiveEmail });
      if (existingUser) {
        throw new GraphQLError(
          'An account with this email address already exists',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
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
          expiresIn: '1d',
        });
        await sendVerificationEmail(email, token);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
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
        if (error instanceof jwt.TokenExpiredError) {
          const expiredToken = jwt.verify(token, config.SECRET, {
            ignoreExpiration: true,
          });
          const expiredVerificationToken = toToken(expiredToken);

          if (expiredVerificationToken.type !== TokenType.Verification) {
            throw new GraphQLError(
              'Verification failed - invalid verification link',
              {
                extensions: {
                  code: 'BAD_USER_INPUT',
                  invalidArgs: token,
                },
              }
            );
          }

          const user = await User.findById(expiredVerificationToken.id);
          if (!user) {
            throw new GraphQLError(
              'Verification failed - no account found with this email',
              {
                extensions: {
                  code: 'USER_NOT_FOUND',
                  invalidArgs: token,
                },
              }
            );
          }
          if (user.verified) {
            throw new GraphQLError('This email is already verified', {
              extensions: {
                code: 'ALREADY_VERIFIED',
                invalidArgs: token,
              },
            });
          }

          throw new GraphQLError(
            'Verification failed - verification link expired',
            {
              extensions: {
                code: 'EXPIRED_TOKEN',
                invalidArgs: token,
                error,
              },
            }
          );
        } else {
          throw new GraphQLError(
            'Verification failed - invalid verification link',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: token,
                error,
              },
            }
          );
        }
      }

      if (verificationToken.type !== TokenType.Verification) {
        throw new GraphQLError(
          'Verification failed - invalid verification link',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: token,
            },
          }
        );
      }

      const user = await User.findById(verificationToken.id);
      if (!user) {
        throw new GraphQLError(
          'Verification failed - no account found with this email',
          {
            extensions: {
              code: 'USER_NOT_FOUND',
              invalidArgs: token,
            },
          }
        );
      }
      if (user.verified) {
        throw new GraphQLError('This email is already verified', {
          extensions: {
            code: 'ALREADY_VERIFIED',
            invalidArgs: token,
          },
        });
      }

      user.verified = true;

      try {
        await user.save();
      } catch (error: unknown) {
        throw new GraphQLError('Verification failed.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      }

      return user;
    },
    resendVerification: async (_root, { token }) => {
      let decodedToken, verificationToken;

      try {
        decodedToken = jwt.verify(token, config.SECRET, {
          ignoreExpiration: true,
        });
        verificationToken = toToken(decodedToken);
      } catch (error: unknown) {
        throw new GraphQLError(
          'Failed to send new email - invalid verification link',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: token,
              error,
            },
          }
        );
      }

      if (verificationToken.type !== TokenType.Verification) {
        throw new GraphQLError(
          'Failed to send new email - invalid verification link',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: token,
            },
          }
        );
      }

      const user = await User.findById(verificationToken.id);
      if (!user) {
        throw new GraphQLError(
          'Failed to send email - no account found with this email',
          {
            extensions: {
              code: 'USER_NOT_FOUND',
              invalidArgs: token,
            },
          }
        );
      }
      if (user.verified) {
        throw new GraphQLError('This email is already verified', {
          extensions: {
            code: 'ALREADY_VERIFIED',
            invalidArgs: token,
          },
        });
      }

      const userForToken: Token = {
        email: user.email,
        id: user._id,
        type: TokenType.Verification,
      };
      const newToken = jwt.sign(userForToken, config.SECRET, {
        expiresIn: '1d',
      });

      try {
        await resendVerificationEmail(user.email, newToken);
      } catch (error: unknown) {
        throw new GraphQLError('Failed to send email.', {
          extensions: {
            code: 'EMAIL_FAILURE',
            error,
          },
        });
      }

      return user;
    },
    createPasswordReset: async (_root, { email }) => {
      try {
        parseEmail(email);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: email,
            },
          });
        }
      }

      const caseInsensitiveEmail = email.toLowerCase();

      const user = await User.findOne({ email: caseInsensitiveEmail });
      if (!user) {
        throw new GraphQLError(
          'Failed to send email - no account found with this email',
          {
            extensions: {
              code: 'USER_NOT_FOUND',
              invalidArgs: email,
            },
          }
        );
      }
      if (!user.verified) {
        throw new GraphQLError('Email not verified', {
          extensions: {
            code: 'UNVERIFIED_EMAIL',
            invalidArgs: email,
          },
        });
      }
      if (
        Date.now() - user.latestPasswordChange.getTime() <
        24 * 60 * 60 * 1000
      ) {
        throw new GraphQLError(
          'Can not set a new password for 24 hours after most recent change',
          {
            extensions: {
              code: 'EARLY_PASSWORD_RESET',
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
        expiresIn: '1d',
      });

      try {
        await sendPasswordResetEmail(email, token);
      } catch (error: unknown) {
        throw new GraphQLError('Failed to send email.', {
          extensions: {
            code: 'EMAIL_FAILURE',
            error,
          },
        });
      }

      return user;
    },
    verifyPasswordToken: async (_root, { token }) => {
      let decodedToken, passwordResetToken;

      try {
        decodedToken = jwt.verify(token, config.SECRET);
        passwordResetToken = toToken(decodedToken);
      } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
          const expiredToken = jwt.verify(token, config.SECRET, {
            ignoreExpiration: true,
          });
          const expiredPasswordResetToken = toToken(expiredToken);

          if (expiredPasswordResetToken.type !== TokenType.Password) {
            throw new GraphQLError('Invalid password reset link', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: token,
              },
            });
          }

          const user = await User.findById(expiredPasswordResetToken.id);
          if (!user) {
            throw new GraphQLError('No account found with this email', {
              extensions: {
                code: 'USER_NOT_FOUND',
                invalidArgs: token,
              },
            });
          }
          if (!user.verified) {
            throw new GraphQLError('Email not verified', {
              extensions: {
                code: 'UNVERIFIED_EMAIL',
                invalidArgs: token,
              },
            });
          }

          throw new GraphQLError('Expired password reset link', {
            extensions: {
              code: 'EXPIRED_TOKEN',
              invalidArgs: token,
              error,
            },
          });
        } else {
          throw new GraphQLError('Invalid password reset link', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: token,
              error,
            },
          });
        }
      }

      if (passwordResetToken.type !== TokenType.Password) {
        throw new GraphQLError(
          'Failed to send new email - invalid verification link',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: token,
            },
          }
        );
      }

      const user = await User.findById(passwordResetToken.id);
      if (!user) {
        throw new GraphQLError('No account found with this email', {
          extensions: {
            code: 'USER_NOT_FOUND',
            invalidArgs: token,
          },
        });
      }
      if (!user.verified) {
        throw new GraphQLError('Email not verified', {
          extensions: {
            code: 'UNVERIFIED_EMAIL',
            invalidArgs: token,
          },
        });
      }
      if (
        Date.now() - user.latestPasswordChange.getTime() <
        24 * 60 * 60 * 1000
      ) {
        throw new GraphQLError(
          'Can not set a new password for 24 hours after most recent change',
          {
            extensions: {
              code: 'EARLY_PASSWORD_RESET',
              invalidArgs: token,
            },
          }
        );
      }

      return user;
    },
  },
};
