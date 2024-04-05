export enum ActivityTypeLabel {
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

export enum ActivityTypeValue {
  APPLIED = "APPLIED",
  SENT_RESUME = "SENT_RESUME",
  ONLINE_ASSESSMENT = "ONLINE_ASSESSMENT",
  INTERVIEWED = "INTERVIEWED",
  REJECTED = "REJECTED",
  CLOSED_FILLED = "CLOSED_FILLED",
  RECEIVED_OFFER = "RECEIVED_OFFER",
  ACCEPTED_OFFER = "ACCEPTED_OFFER",
  DECLINED_OFFER = "DECLINED_OFFER",
}

export interface Activity {
  activityType: `${ActivityTypeValue}`;
  date: string;
  description: string;
}

export type ColorMode = "light" | "dark";
