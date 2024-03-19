import mongoose from "mongoose";

import { ActivityType, Job } from "../types";

const schema = new mongoose.Schema<Job>({
  companyName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  companyWebsite: String,
  jobPostingLink: String,
  contactName: String,
  contactTitle: String,
  notes: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  activities: [
    {
      date: {
        type: String,
        required: true,
      },
      activityType: {
        type: String,
        enum: ActivityType,
        required: true,
      },
      description: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model<Job>("Job", schema);
