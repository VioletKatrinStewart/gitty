const { Router } = require('express');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const GithubUser = require('../models/GithubUser');
const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })

  .get('/login/callback', (req, res, next) => {
    let current = {};
    return exchangeCodeForToken(req.query.code)
      .then((token) => getGithubProfile(token))
      .then((profile) => {
        current = profile;
        return GithubUser.findByUsername(profile.username);
      })
      .then((user) => {
        if (!user)
          return GithubUser.insert({
            username: current.username,
            email: current.email,
            avatar: current.avatar_url,
          })
            .then((user) => {
              res
                .cookie(
                  process.env.COOKIE_NAME,
                  jwt.sign({ ...user }, process.env.JWT_SECRET, {
                    expiresIn: '1 day',
                  }),
                  {
                    httpOnly: true,
                    maxAge: ONE_DAY_IN_MS,
                  }
                )
                .redirect('/api/v1/posts');
            })
            .catch((error) => next(error));
      });
  })

  .delete('/', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out' });
  });
