// routes/post.js

// show
router.get('/:id', function(req, res){

    Promise.all([
        Post.findOne({_id:req.params.id}).populate({ path: 'author', select: 'username' }),
        Comment.find({post:req.params.id}).sort('createdAt').populate({ path: 'author', select: 'username' })
      ])
      .then(([post, comments]) => {
        const commentTrees = util.convertToTrees(comments, '_id','parentComment','childComments'); // 1
          return res.json({post, commentTrees})
      })
      .catch((err) => {
        return res.json(err);
      });
  });