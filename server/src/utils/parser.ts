import { Types, isObjectIdOrHexString } from "mongoose";
import { z } from "zod";

import { Token, TokenType } from "../types";

const TokenTypeEnum = z.nativeEnum(TokenType, {
  errorMap: (issue, ctx) => {
    if (
      issue.code === z.ZodIssueCode.invalid_type ||
      issue.code === z.ZodIssueCode.invalid_enum_value
    ) {
      return { message: "Value of token type incorrect: " + ctx.data };
    }
    return { message: ctx.defaultError };
  },
});

const isObjectIdParam = (param: unknown): param is Types.ObjectId => {
  return isObjectIdOrHexString(param);
};

export const parseNonEmptyStringParam = (
  param: string,
  field: string
): void => {
  z.string()
    .min(1, { message: `${field} must be filled in` })
    .parse(param);
};

export const parseEmail = (param: unknown): string => {
  return z
    .string()
    .email({ message: "Please enter a valid email address" })
    .parse(param);
};

export const parseTokenType = (param: unknown): TokenType => {
  return TokenTypeEnum.parse(param);
};

export const parseObjectIdParam = (
  param: unknown,
  field: string
): Types.ObjectId => {
  if (!param || !isObjectIdParam(param)) {
    throw new Error(`Incorrect or missing ${field}`);
  }

  return param;
};

export const parseDateParam = (date: string, field: string): string => {
  return z.string().date(`Value of ${field} incorrect: ${date}`).parse(date);
};

export const toToken = (object: unknown): Token => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!("email" in object) || !("id" in object) || !("type" in object)) {
    throw new Error("Incorrect data: some fields are missing");
  }

  const token = {
    email: parseEmail(object.email),
    id: parseObjectIdParam(object.id, "id"),
    type: parseTokenType(object.type),
  };

  return token;
};
