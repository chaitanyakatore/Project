import Sprint from '../models/Sprint.js';

class SprintRepository {
  async findByProject(projectId) {
    return await Sprint.find({ project: projectId }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Sprint.findById(id);
  }

  async findActiveSprint(projectId) {
    return await Sprint.findOne({ project: projectId, status: 'Active' });
  }

  async findCompletedSprints(projectId) {
    return await Sprint.find({ project: projectId, status: 'Completed' });
  }

  async create(sprintData) {
    const sprint = new Sprint(sprintData);
    return await sprint.save();
  }

  async save(sprint) {
    return await sprint.save();
  }

  async delete(id) {
    return await Sprint.findByIdAndDelete(id);
  }
}

export default new SprintRepository();
