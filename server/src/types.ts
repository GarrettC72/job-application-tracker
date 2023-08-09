export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verified: boolean;
}

export interface VerifyEmailArgs {
  token: string;
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface VerificationToken {
  email: string;
}

export interface NewUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  verified: boolean;
}
