import Project from '../models/Project.js';

export const getProjects = async (req, res) => {
  const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] })
    .populate('owner', 'name email')
    .populate('members', 'name email');
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email');
  if (project && (project.owner._id.toString() === req.user._id.toString() || project.members.some(m => m._id.toString() === req.user._id.toString()))) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
};

export const createProject = async (req, res) => {
  const { title, description } = req.body;
  const project = new Project({
    title,
    description,
    owner: req.user._id,
  });
  const createdProject = await project.save();
  res.status(201).json(createdProject);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project && project.owner.toString() === req.user._id.toString()) {
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404).json({ message: 'Project not found or unauthorized' });
  }
};

import User from '../models/User.js';
export const addMember = async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.id);

  if (project && project.owner.toString() === req.user._id.toString()) {
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!project.members.includes(userToAdd._id)) {
      project.members.push(userToAdd._id);
      await project.save();
    }
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found or unauthorized' });
  }
};
