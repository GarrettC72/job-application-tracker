import { Types, isObjectIdOrHexString } from "mongoose";
import { z } from "zod";

import { Token, TokenType } from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isTokenType = (param: string): param is TokenType => {
  return Object.values(TokenType)
    .map((v) => v.toString())
    .includes(param);
};

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
  if (!isString(param) || !isTokenType(param)) {
    throw new Error("Value of token type incorrect: " + param);
  }

  return param;
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
