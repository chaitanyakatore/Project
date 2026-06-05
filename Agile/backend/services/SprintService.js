import SprintRepository from '../repositories/SprintRepository.js';
import TaskRepository from '../repositories/TaskRepository.js';

class SprintService {
  async getSprintsByProject(projectId) {
    return await SprintRepository.findByProject(projectId);
  }

  async createSprint(projectId, { name, goal, startDate, endDate }) {
    return await SprintRepository.create({
      name,
      goal,
      startDate,
      endDate,
      project: projectId,
      status: 'Planned'
    });
  }

  async updateSprint(sprintId, { name, goal, startDate, endDate, status }) {
    const sprint = await SprintRepository.findById(sprintId);
    if (!sprint) {
      throw new Error('Sprint not found');
    }

    if (status === 'Active' && sprint.status !== 'Active') {
      // Ensure no other active sprint exists in the project
      const activeSprint = await SprintRepository.findActiveSprint(sprint.project);
      if (activeSprint) {
        throw new Error('There is already an active sprint. Complete it before starting a new one.');
      }
    }

    sprint.name = name !== undefined ? name : sprint.name;
    sprint.goal = goal !== undefined ? goal : sprint.goal;
    sprint.startDate = startDate !== undefined ? startDate : sprint.startDate;
    sprint.endDate = endDate !== undefined ? endDate : sprint.endDate;

    const oldStatus = sprint.status;
    sprint.status = status !== undefined ? status : sprint.status;

    const updatedSprint = await SprintRepository.save(sprint);

    // If a sprint is completed, move all incomplete tasks back to the backlog (sprint = null)
    if (status === 'Completed' && oldStatus !== 'Completed') {
      await TaskRepository.updateMany(
        { sprint: sprintId, status: { $ne: 'Done' } },
        { sprint: null }
      );
    }

    return updatedSprint;
  }

  async getSprintMetrics(sprintId) {
    const sprint = await SprintRepository.findById(sprintId);
    if (!sprint) {
      throw new Error('Sprint not found');
    }

    const tasks = await TaskRepository.findBySprint(sprintId);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    
    const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const completedStoryPoints = tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const remainingStoryPoints = totalStoryPoints - completedStoryPoints;

    const storyCompletionRate = totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0;
    const sprintProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate Velocity: Average completed story points across past completed sprints of the same project
    const completedSprints = await SprintRepository.findCompletedSprints(sprint.project);
    let velocity = 0;
    if (completedSprints.length > 0) {
      let totalCompletedSP = 0;
      for (const cs of completedSprints) {
        const csTasks = await TaskRepository.findBySprint(cs._id);
        const csCompletedSP = csTasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
        totalCompletedSP += csCompletedSP;
      }
      velocity = Math.round(totalCompletedSP / completedSprints.length);
    } else {
      velocity = completedStoryPoints;
    }

    return {
      sprintName: sprint.name,
      status: sprint.status,
      totalTasks,
      completedTasks,
      totalStoryPoints,
      completedStoryPoints,
      remainingStoryPoints,
      storyCompletionRate,
      sprintProgress,
      velocity
    };
  }

  async deleteSprint(sprintId) {
    const sprint = await SprintRepository.findById(sprintId);
    if (!sprint) {
      throw new Error('Sprint not found');
    }

    // Set all tasks in this sprint back to backlog
    await TaskRepository.updateMany(
      { sprint: sprintId },
      { sprint: null }
    );

    await SprintRepository.delete(sprintId);
    return { message: 'Sprint removed' };
  }
}

export default new SprintService();
