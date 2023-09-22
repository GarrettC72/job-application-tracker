import { Types } from "mongoose";

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

interface Activity {
  type: ActivityType;
  date: Date;
  description: string;
}

export interface JobApplication {
  companyName: string;
  companyWebsite?: string;
  jobTitle: string;
  jobPostingLink?: string;
  contactName?: string;
  contactTitle?: string;
  activities?: Array<Activity>;
  notes?: string;
  dateCreated: Date;
  lastModified: Date;
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
