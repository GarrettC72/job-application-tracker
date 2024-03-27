import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

import { Token, TokenType, UserDocument } from "../types";
import { toToken } from "./parser";
import config from "./config";
import User from "../models/user";

export const handleTokenError = async (
  error: unknown,
  token: string,
  type: TokenType.Password | TokenType.Verification,
  verified: boolean
): Promise<GraphQLError> => {
  let invalidMessage, expiredMessage;

  switch (type) {
    case TokenType.Verification:
      invalidMessage = "Verification failed - invalid verification link";
      expiredMessage = "Verification failed - expired verification link";
      break;
    case TokenType.Password:
      invalidMessage = "Invalid password reset link";
      expiredMessage = "Expired password reset link";
      break;
  }

  if (error instanceof jwt.TokenExpiredError) {
    const expiredToken = jwt.verify(token, config.SECRET, {
      ignoreExpiration: true,
    });
    let expiredParsedToken;

    try {
      expiredParsedToken = toToken(expiredToken);
    } catch (parseError: unknown) {
      return new GraphQLError(invalidMessage, {
        extensions: {
          code: "INVALID_TOKEN",
          invalidArgs: token,
          parseError,
        },
      });
    }

    if (expiredParsedToken.type !== type) {
      return new GraphQLError(invalidMessage, {
        extensions: {
          code: "INVALID_TOKEN",
          invalidArgs: token,
        },
      });
    }

    const user = await User.findById(expiredParsedToken.id);

    if (!user) {
      return new GraphQLError("No account found with this email", {
        extensions: {
          code: "USER_NOT_FOUND",
          invalidArgs: token,
        },
      });
    }
    if (user.verified === verified) {
      const errorMessage = verified
        ? "This email is already verified"
        : "This email is not verified";
      const code = verified ? "ALREADY_VERIFIED" : "UNVERIFIED_EMAIL";
      return new GraphQLError(errorMessage, {
        extensions: {
          code,
          invalidArgs: token,
        },
      });
    }

    return new GraphQLError(expiredMessage, {
      extensions: {
        code: "EXPIRED_TOKEN",
        invalidArgs: token,
        error,
      },
    });
  } else {
    return new GraphQLError(invalidMessage, {
      extensions: {
        code: "INVALID_TOKEN",
        invalidArgs: token,
        error,
      },
    });
  }
};

export const getUser = async (
  param: string | Token,
  missingUserMessage: string,
  verified: boolean
): Promise<UserDocument> => {
  let user, invalidArgs;

  switch (typeof param) {
    case "object":
      user = await User.findById(param.id);
      invalidArgs = { token: param };
      break;
    case "string":
      user = await User.findOne({ email: param });
      invalidArgs = { email: param };
      break;
  }

  const verifiedUser = verifyUser(
    user,
    missingUserMessage,
    verified,
    invalidArgs
  );

  return verifiedUser;
};

export const verifyCurrentUser = (
  currentUser: UserDocument | null | undefined
): UserDocument => {
  return verifyUser(currentUser, "Must be signed in", false, { currentUser });
};

export const verifyUser = (
  user: UserDocument | null | undefined,
  missingUserMessage: string,
  verified: boolean,
  invalidArgs: object
): UserDocument => {
  if (!user) {
    throw new GraphQLError(missingUserMessage, {
      extensions: {
        code: "USER_NOT_FOUND",
        invalidArgs,
      },
    });
  }
  if (user.verified === verified) {
    const errorMessage = verified
      ? "This email is already verified"
      : "This email is not verified";
    const code = verified ? "ALREADY_VERIFIED" : "UNVERIFIED_EMAIL";
    throw new GraphQLError(errorMessage, {
      extensions: {
        code,
        invalidArgs,
      },
    });
  }

  return user;
};
