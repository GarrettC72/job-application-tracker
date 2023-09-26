import mongoose from "mongoose";

import { User, UserMethods, UserModel } from "../types";

const schema = new mongoose.Schema<User, UserModel, UserMethods>({
  email: {
    type: String,
    required: true,
  },
  passwordHash: String,
  firstName: {
    type: String,
    requried: true,
  },
  lastName: {
    type: String,
    requried: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  latestPasswordChange: {
    type: Date,
    default: Date.now,
  },
});

schema.method("fullName", function fullName(): string {
  return this.firstName + " " + this.lastName;
});

export default mongoose.model<User, UserModel>("User", schema);
