import React from 'react';
import { Columns, Layers, LogOut, FolderGit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeWorkspace, onWorkspaceChange }) => {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 transition-all flex-shrink-0">
      {/* Title Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/30">
        <FolderGit2 className="text-blue-500" size={24} />
        <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          PROJECT MATRIX
        </span>
      </div>

      {/* Switcher Workspaces */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Workspaces
        </span>
        
        <button
          onClick={() => onWorkspaceChange('Kanban')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
            activeWorkspace === 'Kanban'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
          }`}
        >
          <Columns size={18} />
          Kanban Workspace
        </button>

        <button
          onClick={() => onWorkspaceChange('Scrum')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
            activeWorkspace === 'Scrum'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
          }`}
        >
          <Layers size={18} />
          Agile Workspace
        </button>
      </div>

      {/* User Footer info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-blue-400 border border-slate-600">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="truncate flex-1">
            <h4 className="text-sm font-bold text-slate-200">{user?.name}</h4>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-red-900/10 hover:text-red-400 transition"
        >
          <LogOut size={14} />
          Logout Session
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
