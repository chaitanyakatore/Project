import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignee', 'name email')
    .populate('reporter', 'name email')
    .sort({ position: 1 });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, labels, checklist, issueType, sprint, epic, assignee } = req.body;
  const project = await Project.findById(req.params.projectId);

  if (project && project.owner.toString() === req.user._id.toString()) {
    // Find highest position in the status column
    const highestTask = await Task.findOne({ project: req.params.projectId, status }).sort('-position');
    const position = highestTask ? highestTask.position + 1024 : 1024;

    const task = new Task({
      title,
      description,
      status: status || 'To Do',
      priority,
      dueDate,
      labels: labels || [],
      checklist: checklist || [],
      issueType: issueType || 'Task',
      sprint: sprint || null,
      epic: epic || null,
      assignee: assignee || null,
      reporter: req.user._id,
      project: req.params.projectId,
      position,
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } else {
    res.status(404).json({ message: 'Project not found or unauthorized' });
  }
};

export const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, position, labels, checklist, issueType, sprint, epic, assignee } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.priority = priority !== undefined ? priority : task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.position = position !== undefined ? position : task.position;
    task.labels = labels !== undefined ? labels : task.labels;
    task.checklist = checklist !== undefined ? checklist : task.checklist;
    task.issueType = issueType !== undefined ? issueType : task.issueType;
    task.sprint = sprint !== undefined ? sprint : task.sprint;
    task.epic = epic !== undefined ? epic : task.epic;
    task.assignee = assignee !== undefined ? assignee : task.assignee;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email');
    res.json(populatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};
