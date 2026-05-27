import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@producthubb/shared';

export interface IUser extends User, Document {
  passwordHash: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, index: true },
  companyId: { type: String, index: true },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
