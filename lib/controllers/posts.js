const { Router } = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/authenticate');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const post = await Post.insert(req.body);
    res.send(post);
  } catch (error) {
    error.status = 400;
    next(error);
  }
});
