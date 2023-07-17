import express from 'express';
import { checkUser } from '../middlewares/auth.js';

export const testChatRouter = express.Router();

testChatRouter.get('/', checkUser, (req, res) => {
  return res.status(200).render('test-chat', {});
});
