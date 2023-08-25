import { VerificationToken } from '../types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isEmail = (text: string): boolean => {
  // Taken from HTML specifications
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return text.length > 0 && emailRegExp.test(text);
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

export const toVerificationToken = (object: unknown): VerificationToken => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('email' in object)) {
    throw new Error('Incorrect data: some fields are missing');
  }

  const verificationToken = {
    email: parseStringParam(object.email, 'email'),
  };

  return verificationToken;
};
