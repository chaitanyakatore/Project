import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from '../Kanban/Column';
import BacklogView from './BacklogView';
import { Calendar, Play, CheckCircle2, AlertCircle, KanbanSquare, Layers, Search, User, SlidersHorizontal, RefreshCcw } from 'lucide-react';

const columnsInit = [
  { id: 'Backlog', title: 'Backlog' },
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Code Review', title: 'Code Review' },
  { id: 'Testing', title: 'Testing' },
  { id: 'Done', title: 'Done' }
];

const ScrumBoard = ({
  project,
  tasks,
  sprints,
  onDeleteTask,
  onOpenTask,
  onCreateTask,
  onUpdateTask,
  onDragEnd,
  onCreateSprint,
  onUpdateSprint,
  onDeleteSprint
}) => {
  const [activeTab, setActiveTab] = useState('activeSprint'); // 'activeSprint' or 'backlog'
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Find active sprint
  const activeSprint = sprints.find((s) => s.status === 'Active');

  // Filter tasks for active sprint
  const activeSprintTasks = activeSprint
    ? tasks.filter((t) => t.sprint === activeSprint._id)
    : [];

  // Apply filters on top of active sprint tasks
  const filteredActiveTasks = activeSprintTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAssignee = assigneeFilter === 'all' || 
                            (task.assignee && (task.assignee._id === assigneeFilter || task.assignee === assigneeFilter)) ||
                            (assigneeFilter === 'unassigned' && !task.assignee);
                            
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const handleCompleteSprint = async () => {
    if (!activeSprint) return;
    const confirmComplete = window.confirm(
      `Are you sure you want to complete "${activeSprint.name}"? Incomplete tasks will be moved back to the backlog.`
    );
    if (confirmComplete) {
      try {
        await onUpdateSprint({ id: activeSprint._id, status: 'Completed' });
      } catch (err) {
        alert(err.message || 'Failed to complete sprint');
      }
    }
  };

  const handleStartSprint = async (sprintId) => {
    const confirmStart = window.confirm('Are you sure you want to start this sprint?');
    if (confirmStart) {
      try {
        await onUpdateSprint({ id: sprintId, status: 'Active' });
      } catch (err) {
        alert(err.message || 'Failed to start sprint');
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setAssigneeFilter('all');
    setPriorityFilter('all');
  };

  // Compile list of unique assignees in active sprint tasks for the filter dropdown
  const membersList = [];
  if (project.owner) {
    membersList.push({ _id: project.owner._id || project.owner, name: `${project.owner.name} (Owner)` });
  }
  if (project.members) {
    project.members.forEach(m => {
      const userObj = m.user;
      if (userObj && userObj._id) {
        membersList.push({ _id: userObj._id, name: userObj.name });
      }
    });
  }

  const hasActiveFilters = searchTerm !== '' || assigneeFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="flex flex-col h-full w-full">
      {/* Sub-navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-8 py-2 flex justify-between items-center flex-shrink-0">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('activeSprint')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'activeSprint'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KanbanSquare size={16} /> Active Sprint
          </button>
          <button
            onClick={() => setActiveTab('backlog')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition ${
              activeTab === 'backlog'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={16} /> Backlog & Planning
          </button>
        </div>

        {activeTab === 'activeSprint' && activeSprint && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <Calendar size={14} />
              {activeSprint.startDate ? new Date(activeSprint.startDate).toLocaleDateString() : 'N/A'} -{' '}
              {activeSprint.endDate ? new Date(activeSprint.endDate).toLocaleDateString() : 'N/A'}
            </span>
            <button
              onClick={handleCompleteSprint}
              className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-green-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={14} /> Complete Sprint
            </button>
          </div>
        )}
      </div>

      {/* Interactive Filters Bar (only on Active Board) */}
      {activeTab === 'activeSprint' && activeSprint && (
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-3 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search board..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 transition-all"
              />
            </div>

            {/* Assignee Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <User size={12} /> Assignee:
              </span>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="border border-slate-200 rounded-xl bg-white text-xs font-semibold px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All People</option>
                <option value="unassigned">Unassigned</option>
                {membersList.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <SlidersHorizontal size={12} /> Priority:
              </span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-slate-200 rounded-xl bg-white text-xs font-semibold px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-slate-400 hover:text-purple-600 flex items-center gap-1 transition"
            >
              <RefreshCcw size={12} /> Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'activeSprint' ? (
          activeSprint ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 h-full items-start p-6 overflow-x-auto bg-slate-100/40">
                {columnsInit.map((column) => {
                  const columnTasks = filteredActiveTasks
                    .filter((t) => t.status === column.id)
                    .sort((a, b) => a.position - b.position);
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={columnTasks}
                      onDelete={onDeleteTask}
                      onOpen={onOpenTask}
                    />
                  );
                })}
              </div>
            </DragDropContext>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
              <div className="bg-slate-100 p-4 rounded-full text-slate-400 mb-4">
                <AlertCircle size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Sprint</h3>
              <p className="text-slate-500 mb-6 text-sm">
                There are no sprints currently active for this project. Go to the "Backlog & Planning" tab to plan and start a sprint.
              </p>
              <button
                onClick={() => setActiveTab('backlog')}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-750 transition shadow-md shadow-purple-500/10"
              >
                Go to Sprint Planning
              </button>
            </div>
          )
        ) : (
          <BacklogView
            tasks={tasks}
            sprints={sprints}
            onCreateSprint={onCreateSprint}
            onUpdateSprint={onUpdateSprint}
            onDeleteSprint={onDeleteSprint}
            onCreateTask={onCreateTask}
            onDeleteTask={onDeleteTask}
            onOpenTask={onOpenTask}
            onDragEnd={onDragEnd}
            onStartSprint={handleStartSprint}
          />
        )}
      </div>
    </div>
  );
};

export default ScrumBoard;
