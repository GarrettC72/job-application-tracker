import type { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export const ActivityType = {
  APPLIED: "Submitted Job Application",
  SENT_RESUME: "Sent Resume",
  ONLINE_ASSESSMENT: "Took Online Assessment",
  INTERVIEWED: "Interviewed For Job",
  REJECTED: "Rejected",
  CLOSED_FILLED: "Job Closed/Filled",
  RECEIVED_OFFER: "Received Job Offer",
  ACCEPTED_OFFER: "Accepted Job Offer",
  DECLINED_OFFER: "Declined Job Offer",
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

// export enum ActivityType {
//   APPLIED = "Submitted Job Application",
//   SENT_RESUME = "Sent Resume",
//   ONLINE_ASSESSMENT = "Took Online Assessment",
//   INTERVIEWED = "Interviewed For Job",
//   REJECTED = "Rejected",
//   CLOSED_FILLED = "Job Closed/Filled",
//   RECEIVED_OFFER = "Received Job Offer",
//   ACCEPTED_OFFER = "Accepted Job Offer",
//   DECLINED_OFFER = "Declined Job Offer",
// }

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

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  latestPasswordChange: Date;
}

export type UserDocument = HydratedDocument<User>;

export const TokenType = {
  Verification: "verification",
  Password: "password",
  Login: "login",
} as const;

type TokenType = (typeof TokenType)[keyof typeof TokenType];

// export enum TokenType {
//   Verification = "verification",
//   Password = "password",
//   Login = "login",
// }

export const EmailType = {
  Verify: "Verify",
  Reverify: "Reverify",
  PasswordReset: "PasswordReset",
} as const;

export type EmailType = (typeof EmailType)[keyof typeof EmailType];

// export enum EmailType {
//   Verify = "Verify",
//   Reverify = "Reverify",
//   PasswordReset = "PasswordReset",
// }

export interface Token {
  email: string;
  id: Types.ObjectId;
  type: TokenType;
}

export interface MyContext {
  currentUser?: UserDocument | null;
  clientOrigin: string;
}
