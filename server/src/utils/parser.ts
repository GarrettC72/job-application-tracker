import { Types, isObjectIdOrHexString } from "mongoose";
import { z } from "zod";

import { Token, TokenType } from "../types";

const TokenTypeEnum = z.enum(TokenType, {
  error: (issue) => {
    return { message: "Value of token type incorrect: " + issue.input };
  },
});

const EmailSchema = z.email({ error: "Please enter a valid email address" });
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
  return z.iso.date(`Value of ${field} incorrect: ${date}`).parse(date);
};

export const toToken = (object: unknown): Token => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  return TokenSchema.parse(object);
};
