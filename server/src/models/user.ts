import mongoose from 'mongoose';

import { User } from '../types';

const schema = new mongoose.Schema<User>({
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

export default mongoose.model<User>('User', schema);
