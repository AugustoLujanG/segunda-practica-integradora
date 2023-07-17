import fetch from 'node-fetch';
import passport from 'passport';

import GitHubStrategy from 'passport-github2';
import local from 'passport-local';

import { userModel } from '../DAO/models/users.model.js';
import { createHash, isValidPassword } from '../config.js';
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username }).exec();
        if (!user) {
          console.log('User Not Found with username (email) ' + username);
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          console.log('Invalid Password');
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age, admin } = req.body;
          const user = await userModel.findOne({ email: username }).exec();
          if (user) {
            console.log('User already exists');
            return done(null, false);
          }

          if (!password) {
            throw new Error('No password provided');
          }

          const newUser = {
            age,
            email,
            firstName,
            lastName,
            admin,
            password: createHash(password),
          };
          const userCreated = await userModel.create(newUser);
          console.log('User Registration succesful');
          return done(null, userCreated);
        } catch (e) {
          console.log('Error in register');
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: 'Iv1.8d1e73b7334a46c9',
        clientSecret: '9b879d1e44ccfb387b395cb7d3868192a61e6653',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accesToken, _, profile, done) => {
        console.log(profile);
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find(email => email.verified === true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          const user = await userModel.findOne({ email: profile.email }).exec();
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              password: 'nopass',
            };
            const userCreated = await userModel.create(newUser);
            console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id).exec();
    done(null, user);
  });
}
