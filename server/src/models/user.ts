import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { User } from '../types';

const schema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
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

schema.plugin(uniqueValidator);

export default mongoose.model<User>('User', schema);
