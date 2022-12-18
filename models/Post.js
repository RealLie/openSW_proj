const mongoose = require('mongoose');
const Comment = require('./Comments');

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: { type: String, required: true, default: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});

postSchema.methods.createPost = function (text) {
  const post = new this({
    text: text,
  });
  return post.save();
};
postSchema.pre('remove', async function (next) {
  const post = this;
  try {
    await Comment.deleteMany({ post: post._id });
    next();
  } catch (e) {
    next();
  }
});

module.exports = mongoose.model('Post', postSchema);