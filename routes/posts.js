// routes/posts.js
const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment'); 


  Promise.all([ // 1
      Post.findOne({_id:req.params.id}).populate({ path: 'author', select: 'username' }),
      Comment.find({post:req.params.id}).sort('createdAt').populate({ path: 'author', select: 'username' })
    ])
    .then(([post, comments]) => {
      return res.json({post, comments}); // 1
    })
    .catch((err) => {
      console.log('err: ', err);
      return res.json(err);
    });