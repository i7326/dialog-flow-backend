import { Schema } from 'mongoose';

export const scriptSchema = new Schema({
  name: String,
  description: String,
});
