import ActivityLog from '../models/ActivityLog.js';

class ActivityLogRepository {
  async log({ user, project, task, action, details }) {
    const log = new ActivityLog({ user, project, task, action, details });
    return await log.save();
  }

  async findByProject(projectId) {
    return await ActivityLog.find({ project: projectId })
      .populate('user', 'name email')
      .populate('task', 'title issueType')
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async findByTask(taskId) {
    return await ActivityLog.find({ task: taskId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
  }
}

export default new ActivityLogRepository();
