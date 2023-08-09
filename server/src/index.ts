import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { NewUser, VerifyEmailArgs } from './types';
import { toNewUser, toVerificationToken } from './utils/parser';
import { resendVerificationEmail, sendVerificationEmail } from './utils/mailer';
import config from './utils/config';
import User from './models/user';

mongoose.set('strictQuery', false);

console.log('Connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI ?? '')
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type User {
    id: ID!
    email: String!
    passwordHash: String!
    firstName: String!
    lastName: String!
    verified: Boolean!
  }

  type Token {
    value: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  type Mutation {
    createUser(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): User
    verifyUser(
      token: String!
    ): User
    resendVerification(
      token: String!
    ): User
  }
`;

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
      } catch (error) {
        if (error instanceof TokenExpiredError) {
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
        } else if (error instanceof JsonWebTokenError) {
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
    resendVerification: async (_root: undefined, args: VerifyEmailArgs) => {
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
      } catch (error) {
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
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const start = async () => {
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: config.PORT },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

void start();
