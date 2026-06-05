import Comment from '../models/Comment.js';

class CommentRepository {
  async findByTask(taskId) {
    return await Comment.find({ task: taskId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });
  }

  async findById(id) {
    return await Comment.findById(id);
  }

  async create(commentData) {
    const comment = new Comment(commentData);
    return await comment.save();
  }

  async delete(id) {
    return await Comment.findByIdAndDelete(id);
  }
}

export default new CommentRepository();
