import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { NewUser } from './types';
import { toNewUser } from './utils/parser';
import { sendVerificationEmail } from './utils/mailer';
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
    createUser: async (_root: undefined, args: NewUser) => {
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
        await sendVerificationEmail(email);
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
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

void start();
