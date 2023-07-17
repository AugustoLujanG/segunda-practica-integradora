import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

export const userModel = model(
  'users',
  new Schema({
    firstName: {
      max: 100,
      type: String,
    },
    lastName: {
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

    admin: {
      default: false,
      type: Boolean,
    },
    age: {
      type: Number,
    },
  }).plugin(monsoosePaginate)
);
