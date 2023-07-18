import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

export const userModel = model(
  'users',
  new Schema({
    age: {
      required: false,
      type: Number,
    },
    cartID: {
      required: false,
      type: String,
      unique: true,
    },
    email: {
      max: 100,
      required: true,
      type: String,
      unique: true,
    },
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
    role: {
      default: 'user',
      required: true,
      type: String,
    },
  }).plugin(monsoosePaginate)
);
