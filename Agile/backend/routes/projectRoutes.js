import express from 'express';
import { getProjects, createProject, getProjectById, deleteProject, addMember } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .delete(protect, deleteProject);

router.route('/:id/members')
  .post(protect, addMember);

export default router;
