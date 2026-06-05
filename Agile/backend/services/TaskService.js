import TaskRepository from '../repositories/TaskRepository.js';
import ProjectRepository from '../repositories/ProjectRepository.js';
import appEventEmitter from '../utils/eventEmitter.js';

class TaskService {
  async getTasksByProject(projectId) {
    return await TaskRepository.findByProject(projectId);
  }

  async createTask(projectId, taskData, userId) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Verify if user is owner or member
    const isOwner = (project.owner._id || project.owner).toString() === userId.toString();
    const isMember = project.members.some(m => (m.user?._id || m.user || '').toString() === userId.toString());
    
    if (!isOwner && !isMember) {
      throw new Error('Unauthorized to create tasks in this project');
    }

    const status = taskData.status || 'To Do';
    const highestTask = await TaskRepository.findHighestPosition(projectId, status);
    const position = highestTask ? highestTask.position + 1024 : 1024;

    const task = await TaskRepository.create({
      ...taskData,
      status,
      position,
      project: projectId,
      reporter: userId
    });

    appEventEmitter.emit('TASK_CREATED', { task, userId });
    return task;
  }

  async updateTask(taskId, updateData, userId) {
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const oldStatus = task.status;
    const oldAssignee = task.assignee ? task.assignee.toString() : null;

    // Assign fields dynamically if present
    const fields = ['title', 'description', 'status', 'priority', 'dueDate', 'position', 'labels', 'checklist', 'issueType', 'sprint', 'epic', 'parentTask', 'assignee', 'storyPoints'];
    fields.forEach(field => {
      if (updateData[field] !== undefined) {
        task[field] = updateData[field];
      }
    });

    const updatedTask = await TaskRepository.save(task);
    const populatedTask = await TaskRepository.findById(updatedTask._id);

    // Emit detailed status / assignment events
    if (updateData.status !== undefined && oldStatus !== updateData.status) {
      appEventEmitter.emit('TASK_STATUS_UPDATED', {
        task: populatedTask,
        oldStatus,
        newStatus: updateData.status,
        userId
      });
    }

    const newAssignee = updateData.assignee ? updateData.assignee.toString() : null;
    if (updateData.assignee !== undefined && oldAssignee !== newAssignee) {
      appEventEmitter.emit('TASK_ASSIGNEE_UPDATED', {
        task: populatedTask,
        oldAssignee,
        newAssignee,
        userId
      });
    }

    appEventEmitter.emit('TASK_UPDATED', { task: populatedTask, userId });
    return populatedTask;
  }

  async deleteTask(taskId, userId) {
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const projectId = task.project;
    await TaskRepository.delete(taskId);
    
    appEventEmitter.emit('TASK_DELETED', { taskId, projectId, userId });
    return { message: 'Task removed' };
  }
}

export default new TaskService();
