import { Types } from "mongoose";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  latestPasswordChange: Date;
}

export enum TokenType {
  Verification = "verification",
  Password = "password",
  Login = "login",
}

export interface Token {
  email: string;
  id: Types.ObjectId;
  type: TokenType;
}
