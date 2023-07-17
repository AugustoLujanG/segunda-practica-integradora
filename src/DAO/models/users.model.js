import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

export const userModel = model(
  'users',
  new Schema({
    first_name: {
      max: 100,
      type: String,
    },
    last_name: {
      max: 100,
      type: String,
    },
    password: {
      max: 100,
      required: false,
      type: String,
    },
    email: {
      max: 100,
      required: true,
      type: String,
      unique: true,
    },

    role: {
      default: 'user',
      type: String,
    },
    age: {
      type: Number,
    },
  }).plugin(monsoosePaginate)
);
