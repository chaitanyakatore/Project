import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { LogOut, Plus, Folder, Moon, Sun } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle) return;
    await api.post('/projects', { title: newProjectTitle, description: '' });
    setNewProjectTitle('');
    setIsModalOpen(false);
    fetchProjects();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center transition-colors">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Folder className="text-primary" /> Kanban Boards
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-500 hover:text-primary dark:text-slate-400 transition">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">Hello, {user?.name}</span>
          <button onClick={handleLogout} className="text-slate-500 dark:text-slate-400 hover:text-danger dark:hover:text-danger transition flex items-center gap-1">
            <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Projects</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 shadow-md transition"
          >
            <Plus size={20} /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/project/${project._id}`}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary dark:hover:border-primary transition group block"
            >
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary transition">
                {project.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
              <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No projects found. Create one to get started!
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Create Project</h3>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project Title"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary mb-4"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
                >
                  Create
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
