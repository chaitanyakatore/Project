import Sprint from '../models/Sprint.js';

export const getSprintsByProject = async (req, res) => {
  const sprints = await Sprint.find({ project: req.params.projectId }).sort({ createdAt: -1 });
  res.json(sprints);
};

export const createSprint = async (req, res) => {
  const { name, goal, startDate, endDate } = req.body;
  const sprint = new Sprint({
    name,
    goal,
    startDate,
    endDate,
    project: req.params.projectId
  });
  const createdSprint = await sprint.save();
  res.status(201).json(createdSprint);
};

export const updateSprint = async (req, res) => {
  const { name, goal, startDate, endDate, status } = req.body;
  const sprint = await Sprint.findById(req.params.id);

  if (sprint) {
    sprint.name = name || sprint.name;
    sprint.goal = goal || sprint.goal;
    sprint.startDate = startDate || sprint.startDate;
    sprint.endDate = endDate || sprint.endDate;
    sprint.status = status || sprint.status;

    const updatedSprint = await sprint.save();
    res.json(updatedSprint);
  } else {
    res.status(404).json({ message: 'Sprint not found' });
  }
};

export const deleteSprint = async (req, res) => {
  const sprint = await Sprint.findById(req.params.id);
  if (sprint) {
    await sprint.deleteOne();
    res.json({ message: 'Sprint removed' });
  } else {
    res.status(404).json({ message: 'Sprint not found' });
  }
};
