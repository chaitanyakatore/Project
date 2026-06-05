import ProjectRepository from '../repositories/ProjectRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class ProjectService {
  async getProjectsForUser(userId) {
    return await ProjectRepository.findAllByUser(userId);
  }

  async getProjectById(projectId, userId) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const isOwner = (project.owner._id || project.owner).toString() === userId.toString();
    const isMember = project.members.some(m => (m.user?._id || m.user || '').toString() === userId.toString());

    if (!isOwner && !isMember) {
      throw new Error('Unauthorized access to project');
    }

    return project;
  }

  async createProject({ title, description, projectType }, userId) {
    return await ProjectRepository.create({
      title,
      description,
      owner: userId,
      projectType: projectType || 'Kanban'
    });
  }

  async deleteProject(projectId, userId) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.owner._id.toString() !== userId.toString()) {
      throw new Error('Unauthorized to remove this project');
    }

    await ProjectRepository.delete(projectId);
    return { message: 'Project removed' };
  }

  async addMemberToProject(projectId, email, userId) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.owner._id.toString() !== userId.toString()) {
      throw new Error('Unauthorized to manage members for this project');
    }

    const userToAdd = await UserRepository.findByEmail(email);
    if (!userToAdd) {
      throw new Error('User not found');
    }

    const isAlreadyMember = project.members.some(m => (m.user?._id || m.user || '').toString() === userToAdd._id.toString());
    if (!isAlreadyMember) {
      project.members.push({ user: userToAdd._id, role: 'Developer' });
      await ProjectRepository.save(project);
    }

    return await ProjectRepository.findById(projectId);
  }
}

export default new ProjectService();
