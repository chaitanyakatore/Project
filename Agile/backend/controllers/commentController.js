import CommentService from '../services/CommentService.js';

export const getCommentsByTask = async (req, res) => {
  try {
    const comments = await CommentService.getCommentsByTask(req.params.taskId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await CommentService.createComment(
      req.params.taskId,
      text,
      req.user._id
    );
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const result = await CommentService.deleteComment(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
