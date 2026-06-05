import ProjectService from '../services/ProjectService.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await ProjectService.getProjectsForUser(req.user._id);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await ProjectService.getProjectById(req.params.id, req.user._id);
    res.json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, projectType } = req.body;
    const project = await ProjectService.createProject(
      { title, description, projectType },
      req.user._id
    );
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const result = await ProjectService.deleteProject(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await ProjectService.addMemberToProject(req.params.id, email, req.user._id);
    res.json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

import ActivityLogRepository from '../repositories/ActivityLogRepository.js';
export const getProjectActivities = async (req, res) => {
  try {
    const activities = await ActivityLogRepository.findByProject(req.params.id);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
