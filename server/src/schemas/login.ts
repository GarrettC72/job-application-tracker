import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';

import { Resolvers } from '../__generated__/resolvers-types';
import { parseEmail } from '../utils/parser';
import User from '../models/user';
import config from '../utils/config';

export const typeDef = gql`
  type Token {
    value: String!
  }

  extend type Mutation {
    login(email: String!, password: String!): Token
  }
`;

export const resolvers: Resolvers = {
  Mutation: {
    login: async (_root, { email, password }) => {
      try {
        parseEmail(email);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: password,
            },
          });
        }
      }

      const caseInsensitiveEmail = email.toLowerCase();

      const user = await User.findOne({ email: caseInsensitiveEmail });
      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('Invalid email or password', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: email,
          },
        });
      }

      if (!user.verified) {
        throw new GraphQLError('Email not verified', {
          extensions: {
            code: 'UNVERIFIED_EMAIL',
            invalidArgs: email,
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
