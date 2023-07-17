import express from 'express';
import passport from 'passport';

export const loginRouter = express.Router();

loginRouter.post(
  '/',
  passport.authenticate('login', { failureRedirect: '/login/faillogin' }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).render('error-page', { msg: 'Datos incorrectos' });
    }
    req.session.user = {
      _id: req.user._id,
      age: req.user.age,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
    };

    return res.redirect('/products');
  }
);

loginRouter.get('/faillogin', async (req, res) => {
  return res.status(500).render('error-page', { msg: 'Error inesperado en servidor' });
});
