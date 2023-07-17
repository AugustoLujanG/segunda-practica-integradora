import express from 'express';

export const initRouter = express.Router();

initRouter.get('/', (req, res) => {
  res.render('login-form');
});
