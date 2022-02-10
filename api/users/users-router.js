const express = require('express');
const User = require('./users-model');
const Post = require('./../posts/posts-model');
const { 
  validateUserId, 
  validateUser, 
  validatePost 
} = require('./../middleware/middleware');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await User.get();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateUserId, (req, res, next) => { 
  res.status(200).json(req.user);
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
});

router.post('/', validateUser, (req, res, next) => {
  User.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
});

router.put('/:id', validateUser, validateUserId, (req, res, next) => {
  User.update(req.params.id, req.body)
    .then((updated) => {
      res.status(200).json(updated);
    })
    .catch(next);
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, (req, res, next) => {
  User.remove(req.params.id)
    .then((number) => {
      number === 1 ? res.status(200).json(req.user)
        : res.send(`${number} records were deleted`);
    })
    .catch(next);
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const posts = await User.getUserPosts(req.params.id);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post('/:id/posts', validatePost, validateUserId, async (req, res, next) => {
  try {
    const newPost = await Post.insert({user_id: req.params.id, text: req.body.text})
    res.status(200).json(newPost)
  } catch (err) {
    next(err)
  }
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

// do not forget to export the router
module.exports = router;
