import CommentRepository from '../repositories/CommentRepository.js';

class CommentService {
  async getCommentsByTask(taskId) {
    return await CommentRepository.findByTask(taskId);
  }

  async createComment(taskId, text, authorId) {
    const comment = await CommentRepository.create({
      text,
      task: taskId,
      author: authorId
    });
    // Populate author name and email
    const populated = await comment.populate('author', 'name email');
    return populated;
  }

  async deleteComment(commentId, authorId) {
    const comment = await CommentRepository.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.author.toString() !== authorId.toString()) {
      throw new Error('Unauthorized to remove this comment');
    }

    await CommentRepository.delete(commentId);
    return { message: 'Comment removed' };
  }
}

export default new CommentService();
