import express from 'express';
import { checkUser } from '../middlewares/auth.js';

export const testChatRouter = express.Router();

testChatRouter.get('/', checkUser, (req, res) => {
  const user = req.session.user.first_name;
  const role = req.session.user.role;

  return res.status(200).render('test-chat', { user, role });
});
