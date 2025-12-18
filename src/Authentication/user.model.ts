// src/Authentication/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  authProvider?: 'local' | 'google';
  createdAt?: Date;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  googleId: { type: String, default: null },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function (this: any) {
      return this.authProvider === 'local';
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);