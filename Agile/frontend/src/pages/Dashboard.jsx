import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import api from '../services/api';
import { Plus, Folder } from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState('Kanban'); // 'Kanban' or 'Scrum'
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectType, setNewProjectType] = useState('Kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle) return;
    try {
      await api.post('/projects', { 
        title: newProjectTitle, 
        description: newProjectDescription, 
        projectType: newProjectType 
      });
      setNewProjectTitle('');
      setNewProjectDescription('');
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const openCreateModal = () => {
    setNewProjectType(activeWorkspace);
    setIsModalOpen(true);
  };

  // Filter projects depending on selected workspace selection
  const filteredProjects = projects.filter((project) => {
    const type = project.projectType || 'Kanban';
    return type === activeWorkspace;
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Workspace Switcher Sidebar */}
      <Sidebar 
        activeWorkspace={activeWorkspace} 
        onWorkspaceChange={setActiveWorkspace} 
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header bar */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-5 flex justify-between items-center flex-shrink-0">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
            <Folder className={activeWorkspace === 'Scrum' ? 'text-purple-600' : 'text-blue-600'} />
            {activeWorkspace === 'Scrum' ? 'Agile Scrum Workspace' : 'Kanban Workspace'}
          </h1>
          <button
            onClick={openCreateModal}
            className={`text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md transition text-sm ${
              activeWorkspace === 'Scrum' 
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/10' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
            }`}
          >
            <Plus size={16} /> New Project
          </button>
        </header>

        {/* Projects Viewport */}
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider">
              {activeWorkspace === 'Scrum' ? 'Agile Scrum Boards' : 'Kanban Boards'}
            </h2>
            <span className="text-xs text-slate-400 font-bold bg-slate-200/55 px-2.5 py-1 rounded-full">
              {filteredProjects.length} Projects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project._id}
                to={`/project/${project._id}`}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition group flex flex-col min-h-[160px]"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                  {project.description || 'No description provided.'}
                </p>
                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${
                    project.projectType === 'Scrum' 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {project.projectType || 'Kanban'}
                  </span>
                </div>
              </Link>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full bg-white border border-slate-200 rounded-2xl py-16 text-center text-slate-500 shadow-sm">
                <Folder size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Projects Found</h3>
                <p className="text-sm text-slate-400 mb-6">
                  You don't have any projects in this workspace yet.
                </p>
                <button
                  onClick={openCreateModal}
                  className={`text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm ${
                    activeWorkspace === 'Scrum' ? 'bg-purple-600 hover:bg-purple-750' : 'bg-blue-600 hover:bg-blue-750'
                  }`}
                >
                  Create one now
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Create Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-1">Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sprint Tracker"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-800 text-sm font-semibold"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  placeholder="Optional details..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-slate-800 text-sm font-semibold"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-600 mb-1">Project Workspace Type</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 text-sm font-semibold"
                  value={newProjectType}
                  onChange={(e) => setNewProjectType(e.target.value)}
                >
                  <option value="Kanban">Kanban Workspace (Simple Columns)</option>
                  <option value="Scrum">Agile Scrum Workspace (Backlog & Sprints)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm ${
                    newProjectType === 'Scrum' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
