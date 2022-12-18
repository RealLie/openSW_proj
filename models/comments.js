const mongoose = require('mongoose');
const commentSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      require: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentComment: { // 1
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    text: {
      type: String,
      required: true,
    },
    depth: {
      type: Number,
      default: 1,
    },
    isDeleted: { // 2
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } },
);
commentSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
});

commentSchema
  .virtual('childComments')
  .get(function () {
    return this._childComments;
  })
  .set(function (v) {
    this._childComments = v;
  });

module.exports = mongoose.model('Comment', commentSchema);