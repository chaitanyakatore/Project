import Comment from '../models/Comment.js';

export const getCommentsByTask = async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId }).populate('author', 'name email').sort({ createdAt: 1 });
  res.json(comments);
};

export const createComment = async (req, res) => {
  const { text } = req.body;
  const comment = new Comment({
    text,
    task: req.params.taskId,
    author: req.user._id
  });
  const createdComment = await comment.save();
  const populatedComment = await createdComment.populate('author', 'name email');
  res.status(201).json(populatedComment);
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment && comment.author.toString() === req.user._id.toString()) {
    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404).json({ message: 'Comment not found or unauthorized' });
  }
};
