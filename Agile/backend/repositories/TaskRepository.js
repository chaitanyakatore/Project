import Task from '../models/Task.js';

class TaskRepository {
  async findByProject(projectId) {
    return await Task.find({ project: projectId })
      .populate('assignee', 'name email')
      .populate('reporter', 'name email')
      .sort({ position: 1 });
  }

  async findBySprint(sprintId) {
    return await Task.find({ sprint: sprintId });
  }

  async find(filter) {
    return await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email')
      .sort({ position: 1 });
  }

  async findById(id) {
    return await Task.findById(id)
      .populate('assignee', 'name email')
      .populate('reporter', 'name email');
  }

  async findHighestPosition(projectId, status) {
    return await Task.findOne({ project: projectId, status }).sort('-position');
  }

  async create(taskData) {
    const task = new Task(taskData);
    return await task.save();
  }

  async save(task) {
    return await task.save();
  }

  async delete(id) {
    return await Task.findByIdAndDelete(id);
  }

  async updateMany(filter, update) {
    return await Task.updateMany(filter, update);
  }
}

export default new TaskRepository();
