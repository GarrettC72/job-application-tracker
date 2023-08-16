import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gql from 'graphql-tag';

import { Resolvers } from '../__generated__/resolvers-types';
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
    login: async (_root, args) => {
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
