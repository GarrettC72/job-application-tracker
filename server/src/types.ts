import { Model, Types } from "mongoose";

export enum ActivityType {
  APPLIED = "Submitted Job Application",
  SENT_RESUME = "Sent Resume",
  ONLINE_ASSESSMENT = "Took Online Assessment",
  INTERVIEWED = "Interviewed For Job",
  REJECTED = "Rejected",
  CLOSED_FILLED = "Job Closed/Filled",
  RECEIVED_OFFER = "Received Job Offer",
  ACCEPTED_OFFER = "Accepted Job Offer",
  DECLINED_OFFER = "Declined Job Offer",
}

export interface Activity {
  activityType: ActivityType;
  date: string;
  description: string;
}

export interface UserDetails {
  _id: Types.ObjectId;
  id: string;
  email: string;
}

export interface Job {
  id: string;
  companyName: string;
  companyWebsite: string;
  jobTitle: string;
  jobPostingLink: string;
  contactName: string;
  contactTitle: string;
  activities: Activity[];
  notes: string;
  dateCreated: Date;
  lastModified: Date;
  latestActivity: ActivityType;
  user: Types.ObjectId;
}

export type NewJob = Omit<
  Job,
  "id" | "dateCreated" | "lastModified" | "latestActivity" | "user"
>;

export interface User {
  _id: Types.ObjectId;
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  latestPasswordChange: Date;
}

export interface UserMethods {
  fullName(): string;
}

export type UserModel = Model<User, Record<string, never>, UserMethods>;

export enum TokenType {
  Verification = "verification",
  Password = "password",
  Login = "login",
}

export enum EmailType {
  Verify = "Verify",
  Reverify = "Reverify",
  PasswordReset = "PasswordReset",
}

export interface Token {
  email: string;
  id: Types.ObjectId;
  type: TokenType;
}

export interface MyContext {
  currentUser?: InstanceType<UserModel> | null;
  clientOrigin: string;
}
