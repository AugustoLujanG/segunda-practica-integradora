export function checkUser(req, res, next) {
  if (req.session?.user?.email) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'Please log in' });
}

export function checkAdmin(req, res, next) {
  if (req?.session?.user?.email && req?.session?.user.admin === true) {
    return next();
  }
  return res.status(401).render('error-admin-page', { msg: 'Please log in AS ADMIN!' });
}
