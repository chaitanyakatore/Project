import SprintService from '../services/SprintService.js';

export const getSprintsByProject = async (req, res) => {
  try {
    const sprints = await SprintService.getSprintsByProject(req.params.projectId);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSprint = async (req, res) => {
  try {
    const sprint = await SprintService.createSprint(req.params.projectId, req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSprint = async (req, res) => {
  try {
    const sprint = await SprintService.updateSprint(req.params.id, req.body);
    res.json(sprint);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSprintMetrics = async (req, res) => {
  try {
    const metrics = await SprintService.getSprintMetrics(req.params.id);
    res.json(metrics);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteSprint = async (req, res) => {
  try {
    const result = await SprintService.deleteSprint(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
