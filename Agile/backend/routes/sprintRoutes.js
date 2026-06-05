import express from 'express';
import { getSprintsByProject, createSprint, updateSprint, deleteSprint, getSprintMetrics } from '../controllers/sprintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/project/:projectId')
  .get(protect, getSprintsByProject)
  .post(protect, createSprint);

router.route('/:id')
  .put(protect, updateSprint)
  .delete(protect, deleteSprint);

router.route('/:id/metrics')
  .get(protect, getSprintMetrics);

export default router;
