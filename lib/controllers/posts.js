const { Router } = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, (req, res, next) => {
    const { text } = req.body;
    return Post.insert({ text })
      .then((post) => res.send(post))
      .catch((error) => next(error));
  })

  .get('/', authenticate, (req, res, next) => {
    Post.findAll()
      .then((post) => res.send(post))
      .catch((error) => next(error));
  });
