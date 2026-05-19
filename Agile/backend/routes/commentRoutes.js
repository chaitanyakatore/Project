import express from 'express';
import { getCommentsByTask, createComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/task/:taskId')
  .get(protect, getCommentsByTask)
  .post(protect, createComment);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
