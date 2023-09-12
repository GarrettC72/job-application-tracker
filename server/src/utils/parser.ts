import { Types, isObjectIdOrHexString } from 'mongoose';

import { Token, TokenType } from '../types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isEmail = (text: string): boolean => {
  // Taken from HTML specifications
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return text.length > 0 && emailRegExp.test(text);
};

const isTokenType = (param: string): param is TokenType => {
  return Object.values(TokenType)
    .map((v) => v.toString())
    .includes(param);
};

const isObjectIdParam = (param: unknown): param is Types.ObjectId => {
  return isObjectIdOrHexString(param);
};

const parseStringParam = (param: unknown, field: string): string => {
  if (!isString(param)) {
    throw new Error(`Incorrect or missing ${field}`);
  }

  return param;
};

export const parseEmail = (param: unknown): string => {
  if (!isString(param) || !isEmail(param)) {
    throw new Error(`Please enter a valid email address`);
  }

  return param;
};

export const parseTokenType = (param: unknown): TokenType => {
  if (!isString(param) || !isTokenType(param)) {
    throw new Error('Value of token type incorrect: ' + param);
  }

  return param;
};

export const parseObjectIdParam = (
  param: unknown,
  field: string
): Types.ObjectId => {
  if (!param || !isObjectIdParam(param)) {
    throw new Error(`Incorrect or missing ${field}:`);
  }

  return param;
};

export const toToken = (object: unknown): Token => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('email' in object) || !('id' in object) || !('type' in object)) {
    throw new Error('Incorrect data: some fields are missing');
  }

  const token = {
    email: parseStringParam(object.email, 'email'),
    id: parseObjectIdParam(object.id, 'id'),
    type: parseTokenType(object.type),
  };

  return token;
};
