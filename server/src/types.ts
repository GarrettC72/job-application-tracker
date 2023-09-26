import { Model, Types } from "mongoose";

export enum ActivityType {
  Applied = "Submitted Job Application",
  SentResume = "Sent Resume",
  OnlineAssessment = "Took Online Assessment",
  Interviewed = "Interviewed For Job",
  Rejected = "Rejected",
  ClosedFilled = "Job Closed/Filled",
  ReceivedOffer = "Received Job Offer",
  AcceptedOffer = "Accepted Job Offer",
  DeclinedOffer = "Declined Job Offer",
}

export interface Activity {
  activityType: ActivityType;
  date: string;
  description: string;
}

export interface Job {
  id: string;
  companyName: string;
  companyWebsite: string;
  jobTitle: string;
  jobPostingLink: string;
  contactName: string;
  contactTitle: string;
  activities: Array<Activity>;
  notes: string;
  dateCreated: Date;
  lastModified: Date;
  user: Types.ObjectId;
}

export type NewJob = Omit<Job, "id" | "dateCreated" | "lastModified" | "user">;

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

export interface Token {
  email: string;
  id: Types.ObjectId;
  type: TokenType;
}

export interface MyContext {
  currentUser?: InstanceType<UserModel>;
}
