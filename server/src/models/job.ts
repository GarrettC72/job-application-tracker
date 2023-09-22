import mongoose from "mongoose";

import { JobApplication } from "../types";

const schema = new mongoose.Schema<JobApplication>({
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
        type: Date,
        default: Date.now,
      },
      type: String,
      description: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model<JobApplication>("Job", schema);
