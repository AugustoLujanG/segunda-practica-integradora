import { Schema, model } from 'mongoose';

export const msgModel = model(
  'messages',
  new Schema({
    message: { type: String, required: true, max: 100 },
    user: { type: String, required: true, max: 100 },
  })
);
