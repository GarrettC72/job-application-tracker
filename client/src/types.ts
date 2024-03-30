export interface LoginData {
  token: string;
  email: string;
  name: string;
}

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

export type ColorMode = "light" | "dark";
