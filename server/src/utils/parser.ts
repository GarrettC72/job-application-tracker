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

const EmailSchema = z
  .string({
    required_error: "Missing email address",
  })
  .email({ message: "Please enter a valid email address" });
const TokenSchema = z.object({
  email: EmailSchema,
  id: z.custom<Types.ObjectId>(
    (val) => isObjectIdOrHexString(val),
    "Incorrect or missing id"
  ),
  type: TokenTypeEnum,
});

export const parseNonEmptyStringParam = (
  param: string,
  field: string
): void => {
  z.string()
    .min(1, { message: `${field} must be filled in` })
    .parse(param);
};

export const parseEmail = (param: unknown): string => {
  return EmailSchema.parse(param);
};

export const parseDateParam = (date: string, field: string): string => {
  return z.string().date(`Value of ${field} incorrect: ${date}`).parse(date);
};

export const toToken = (object: unknown): Token => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  return TokenSchema.parse(object);
};
