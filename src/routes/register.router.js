import express from 'express';
import passport from 'passport';

export const registerRouter = express.Router();

registerRouter.get('/', (req, res) => {
  res.render('register-form');
});

registerRouter.post(
  '/',
  passport.authenticate('register', { failureRedirect: '/register/failregister' }),
  (req, res) => {
    if (!req.user) {
      return res.status(400).render('error-page', { msg: 'User already exists' });
    }
    req.session.user = {
      _id: req.user._id,
      age: req.user.age,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      admin: req.user.admin,
    };

    return res.status(201).render('success-login');
  }
);

registerRouter.get('/failregister', async (req, res) => {
  return res.status(400).render('error-page', { msg: 'Controla tu email e intenta más tarde' });
});
