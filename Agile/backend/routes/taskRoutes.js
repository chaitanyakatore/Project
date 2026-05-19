import express from 'express';
import { getTasksByProject, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Note: projectId comes from a potential nested route, or we can pass it in the body/params.
// Let's use /api/tasks/:projectId for GET and POST
router.route('/project/:projectId')
  .get(protect, getTasksByProject)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
