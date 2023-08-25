import mongoose from 'mongoose';

import { User } from '../types';

const schema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
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
});

export default mongoose.model<User>('User', schema);
