import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { LoginArgs, NewUser, VerifyEmailArgs } from './types';
import { toNewUser, toVerificationToken } from './utils/parser';
import { resendVerificationEmail, sendVerificationEmail } from './utils/mailer';
import User from './models/user';
import config from './utils/config';

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async (_root: never, args: NewUser) => {
      try {
        const { email, password, firstName, lastName, verified } =
          toNewUser(args);

        if (password.length < 8) {
          throw new GraphQLError('Password must have minimum length 8', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.password,
            },
          });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
          email,
          passwordHash,
          firstName,
          lastName,
          verified,
        });

        await user.save();

        const userForToken = {
          email: user.email,
        };
        const token = jwt.sign(userForToken, config.SECRET, {
          expiresIn: '1d',
        });
        await sendVerificationEmail(email, token);

        return user;
      } catch (error: unknown) {
        if (error instanceof Error) {
          const errorMessage = 'Something went wrong. Error: ' + error.message;
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: 'BAD_USER_INPUT',
              error,
            },
          });
        } else {
          throw new GraphQLError(
            `Creating user failed - email already exists`,
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.email,
                error,
              },
            }
          );
        }
      }
    },
    verifyUser: async (_root: never, args: VerifyEmailArgs) => {
      try {
        const decodedToken = jwt.verify(args.token, config.SECRET);
        const verificationToken = toVerificationToken(decodedToken);

        const user = await User.findOne({ email: verificationToken.email });
        if (!user) {
          throw new GraphQLError(`Verification failed - account not found`, {
            extensions: {
              code: 'USER_NOT_FOUND',
              invalidArgs: args.token,
            },
          });
        }

        if (user.verified) {
          throw new GraphQLError(`This email is already verified`, {
            extensions: {
              code: 'ALREADY_VERIFIED',
              invalidArgs: args.token,
            },
          });
        }

        user.verified = true;
        await user.save();

        return user;
      } catch (error: unknown) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new GraphQLError(
            `Verification failed - verification link expired`,
            {
              extensions: {
                code: 'EXPIRED_TOKEN',
                invalidArgs: args.token,
                error,
              },
            }
          );
        } else if (error instanceof jwt.JsonWebTokenError) {
          throw new GraphQLError(
            `Verification failed - invalid verification link`,
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.token,
                error,
              },
            }
          );
        } else if (error instanceof Error) {
          const errorMessage = 'Something went wrong. Error: ' + error.message;
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: 'BAD_USER_INPUT',
              error,
            },
          });
        } else {
          throw new GraphQLError('Something went wrong.', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error,
            },
          });
        }
      }
    },
    resendVerification: async (_root: never, args: VerifyEmailArgs) => {
      try {
        const decodedToken = jwt.verify(args.token, config.SECRET, {
          ignoreExpiration: true,
        });
        const verificationToken = toVerificationToken(decodedToken);

        const user = await User.findOne({ email: verificationToken.email });
        if (!user) {
          throw new GraphQLError(`Verification failed - account not found`, {
            extensions: {
              code: 'USER_NOT_FOUND',
              invalidArgs: args.token,
            },
          });
        }

        if (user.verified) {
          throw new GraphQLError(`This email is already verified`, {
            extensions: {
              code: 'ALREADY_VERIFIED',
              invalidArgs: args.token,
            },
          });
        }

        const userForToken = {
          email: user.email,
        };
        const token = jwt.sign(userForToken, config.SECRET, {
          expiresIn: '1d',
        });
        await resendVerificationEmail(user.email, token);

        return user;
      } catch (error: unknown) {
        if (error instanceof Error) {
          const errorMessage = 'Something went wrong. Error: ' + error.message;
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: 'BAD_USER_INPUT',
              error,
            },
          });
        } else {
          throw new GraphQLError('Something went wrong.', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error,
            },
          });
        }
      }
    },
    login: async (_root: never, args: LoginArgs) => {
      const user = await User.findOne({ email: args.email });
      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('Invalid email or password', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.email,
          },
        });
      }

      const userForToken = {
        email: user.email,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, config.SECRET) };
    },
  },
};

export default resolvers;
