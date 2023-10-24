export interface LoginData {
  token: string;
  email: string;
  name: string;
}

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

export interface SimpleJob {
  id: string;
  companyName: string;
  jobTitle: string;
  latestActivity: string;
  dateCreated: string;
  lastModified: string;
}
