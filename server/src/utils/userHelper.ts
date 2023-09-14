import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import { Token, TokenType } from '../types';
import { toToken } from './parser';
import config from './config';
import User from '../models/user';

export const handleTokenError = async (
  error: unknown,
  token: string,
  type: TokenType.Password | TokenType.Verification,
  verified: boolean
) => {
  let invalidMessage, expiredMessage;

  switch (type) {
    case TokenType.Verification:
      invalidMessage = 'Verification failed - invalid verification link';
      expiredMessage = 'Verification failed - expired verification link';
      break;
    case TokenType.Password:
      invalidMessage = 'Invalid password reset link';
      expiredMessage = 'Expired password reset link';
      break;
  }

  if (error instanceof jwt.TokenExpiredError) {
    const expiredToken = jwt.verify(token, config.SECRET, {
      ignoreExpiration: true,
    });
    const expiredParsedToken = toToken(expiredToken);

    if (expiredParsedToken.type !== type) {
      throw new GraphQLError(invalidMessage, {
        extensions: {
          code: 'INVALID_TOKEN',
          invalidArgs: token,
        },
      });
    }

    const user = await User.findById(expiredParsedToken.id);
    if (!user) {
      throw new GraphQLError('No account found with this email', {
        extensions: {
          code: 'USER_NOT_FOUND',
          invalidArgs: token,
        },
      });
    }
    if (user.verified === verified) {
      const errorMessage = verified
        ? 'This email is already verified'
        : 'This email is not verified';
      throw new GraphQLError(errorMessage, {
        extensions: {
          code: 'ALREADY_VERIFIED',
          invalidArgs: token,
        },
      });
    }

    throw new GraphQLError(expiredMessage, {
      extensions: {
        code: 'EXPIRED_TOKEN',
        invalidArgs: token,
        error,
      },
    });
  } else {
    throw new GraphQLError(invalidMessage, {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: token,
        error,
      },
    });
  }
};

export const getUserWithToken = async (
  token: Token,
  missingUserMessage: string,
  verified: boolean
) => {
  const user = await User.findById(token.id);
  if (!user) {
    throw new GraphQLError(missingUserMessage, {
      extensions: {
        code: 'USER_NOT_FOUND',
        invalidArgs: token,
      },
    });
  }
  if (user.verified === verified) {
    const errorMessage = verified
      ? 'This email is already verified'
      : 'This email is not verified';
    throw new GraphQLError(errorMessage, {
      extensions: {
        code: 'ALREADY_VERIFIED',
        invalidArgs: token,
      },
    });
  }

  return user;
};

export const getUserWithEmail = async (
  email: string,
  missingUserMessage: string,
  verified: boolean
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new GraphQLError(missingUserMessage, {
      extensions: {
        code: 'USER_NOT_FOUND',
        invalidArgs: email,
      },
    });
  }
  if (user.verified === verified) {
    const errorMessage = verified
      ? 'This email is already verified'
      : 'This email is not verified';
    throw new GraphQLError(errorMessage, {
      extensions: {
        code: 'ALREADY_VERIFIED',
        invalidArgs: email,
      },
    });
  }

  return user;
};
