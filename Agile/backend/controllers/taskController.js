import TaskService from '../services/TaskService.js';

export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await TaskService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await TaskService.createTask(req.params.projectId, req.body, req.user._id);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.body, req.user._id);
    res.json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const result = await TaskService.deleteTask(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
