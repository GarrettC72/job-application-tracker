import { NewUser, VerificationToken } from '../types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseStringParam = (param: unknown, field: string): string => {
  if (!isString(param)) {
    throw new Error(`Incorrect or missing ${field}`);
  }

  return param;
};

export const toNewUser = (object: unknown): NewUser => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    !('email' in object) ||
    !('password' in object) ||
    !('firstName' in object) ||
    !('lastName' in object)
  ) {
    throw new Error('Incorrect data: some fields are missing');
  }

  const newUser = {
    email: parseStringParam(object.email, 'email'),
    password: parseStringParam(object.password, 'password'),
    firstName: parseStringParam(object.firstName, 'firstName'),
    lastName: parseStringParam(object.lastName, 'lastName'),
    verified: false,
  };

  return newUser;
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
