import Project from '../models/Project.js';

class ProjectRepository {
  async findAllByUser(userId) {
    return await Project.find({ $or: [{ owner: userId }, { 'members.user': userId }] })
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
  }

  async findById(id) {
    return await Project.findById(id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');
  }

  async create(projectData) {
    const project = new Project(projectData);
    return await project.save();
  }

  async delete(id) {
    return await Project.findByIdAndDelete(id);
  }

  async save(project) {
    return await project.save();
  }
}

export default new ProjectRepository();
