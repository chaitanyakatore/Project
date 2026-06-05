import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGetProjectQuery,
  useGetTasksQuery,
  useGetSprintsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
  useAddMemberMutation
} from '../services/apiSlice';
import BoardFactory from '../components/Board/BoardFactory';
import ProjectDashboard from '../components/Board/ProjectDashboard';
import IssueView from '../components/Kanban/IssueView';
import { ArrowLeft, Plus, Calendar, Tag, CheckSquare, Users, UserPlus, X, BarChart3 } from 'lucide-react';

const ProjectBoard = () => {
  const { id: projectId } = useParams();
  
  // RTK Query endpoints for declarative fetching and auto caching (SOLID Interface Segregation)
  const { data: project, isLoading: isProjectLoading, error: projectError } = useGetProjectQuery(projectId);
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTasksQuery(projectId);
  const { data: sprints = [], isLoading: isSprintsLoading } = useGetSprintsQuery(projectId);

  // Mutations
  const [createTaskMutation] = useCreateTaskMutation();
  const [updateTaskMutation] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [createSprintMutation] = useCreateSprintMutation();
  const [updateSprintMutation] = useUpdateSprintMutation();
  const [deleteSprintMutation] = useDeleteSprintMutation();
  const [addMemberMutation] = useAddMemberMutation();

  // Component UI State
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'dashboard'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Task creation state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskLabels, setNewTaskLabels] = useState('');
  const [newTaskChecklist, setNewTaskChecklist] = useState('');
  const [newTaskIssueType, setNewTaskIssueType] = useState('Task');
  const [newTaskStoryPoints, setNewTaskStoryPoints] = useState(0);

  // Member invitation state
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Developer');
  const [memberError, setMemberError] = useState('');
  const [memberSuccess, setMemberSuccess] = useState('');

  // Wrap service/mutation triggers
  const createTask = async (taskData) => {
    return await createTaskMutation({ projectId, ...taskData }).unwrap();
  };

  const updateTask = async (taskId, updateFields) => {
    return await updateTaskMutation({ id: taskId, ...updateFields }).unwrap();
  };

  const deleteTask = async (taskId) => {
    return await deleteTaskMutation(taskId).unwrap();
  };

  const createSprint = async (sprintData) => {
    return await createSprintMutation({ projectId, ...sprintData }).unwrap();
  };

  const updateSprint = async (sprintId, sprintData) => {
    return await updateSprintMutation({ id: sprintId, ...sprintData }).unwrap();
  };

  const deleteSprint = async (sprintId) => {
    return await deleteSprintMutation(sprintId).unwrap();
  };

  // Unified drag end handler supporting Column status drags and Backlog/Sprint drags
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskToMove = tasks.find((t) => t._id === draggableId);
    if (!taskToMove) return;

    const isBacklogOrSprintId = (id) => id === 'backlog' || /^[0-9a-fA-F]{24}$/.test(id);
    const isPlanningDrag = isBacklogOrSprintId(source.droppableId) && isBacklogOrSprintId(destination.droppableId);

    if (isPlanningDrag) {
      const destSprintId = destination.droppableId === 'backlog' ? null : destination.droppableId;
      const destTasks = tasks
        .filter(t => t.sprint === destSprintId)
        .sort((a, b) => a.position - b.position);
      
      const filteredDestTasks = destTasks.filter(t => t._id !== draggableId);
      filteredDestTasks.splice(destination.index, 0, taskToMove);

      let newPosition = 1024;
      if (filteredDestTasks.length === 1) {
        newPosition = 1024;
      } else if (destination.index === 0) {
        newPosition = filteredDestTasks[1].position / 2;
      } else if (destination.index === filteredDestTasks.length - 1) {
        newPosition = filteredDestTasks[filteredDestTasks.length - 2].position + 1024;
      } else {
        const prevPos = filteredDestTasks[destination.index - 1].position;
        const nextPos = filteredDestTasks[destination.index + 1].position;
        newPosition = (prevPos + nextPos) / 2;
      }

      try {
        await updateTaskMutation({
          id: draggableId,
          sprint: destSprintId,
          position: newPosition
        }).unwrap();
      } catch (err) {
        console.error('Failed to update task sprint/position:', err);
      }
    } else {
      const destStatus = destination.droppableId;
      const destTasks = tasks
        .filter(t => t.status === destStatus && (project.projectType === 'Scrum' ? t.sprint === taskToMove.sprint : true))
        .sort((a, b) => a.position - b.position);
      
      const filteredDestTasks = destTasks.filter(t => t._id !== draggableId);
      filteredDestTasks.splice(destination.index, 0, taskToMove);

      let newPosition = 1024;
      if (filteredDestTasks.length === 1) {
        newPosition = 1024;
      } else if (destination.index === 0) {
        newPosition = filteredDestTasks[1].position / 2;
      } else if (destination.index === filteredDestTasks.length - 1) {
        newPosition = filteredDestTasks[filteredDestTasks.length - 2].position + 1024;
      } else {
        const prevPos = filteredDestTasks[destination.index - 1].position;
        const nextPos = filteredDestTasks[destination.index + 1].position;
        newPosition = (prevPos + nextPos) / 2;
      }

      try {
        await updateTaskMutation({
          id: draggableId,
          status: destStatus,
          position: newPosition
        }).unwrap();
      } catch (err) {
        console.error('Failed to update task status/position:', err);
      }
    }
  };

  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      const labelsArray = newTaskLabels.split(',').map(l => l.trim()).filter(l => l);
      const checklistArray = newTaskChecklist.split(',').map(c => ({ text: c.trim(), isCompleted: false })).filter(c => c.text);

      const activeSprint = sprints.find(s => s.status === 'Active');
      const sprintId = project.projectType === 'Scrum' && activeSprint ? activeSprint._id : null;

      await createTask({
        title: newTaskTitle,
        status: 'To Do',
        priority: 'Medium',
        issueType: newTaskIssueType,
        storyPoints: Number(newTaskStoryPoints) || 0,
        dueDate: newTaskDueDate || undefined,
        labels: labelsArray,
        checklist: checklistArray,
        sprint: sprintId
      });

      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskLabels('');
      setNewTaskChecklist('');
      setNewTaskIssueType('Task');
      setNewTaskStoryPoints(0);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setMemberError('');
    setMemberSuccess('');
    if (!newMemberEmail) return;

    try {
      await addMemberMutation({
        projectId,
        email: newMemberEmail,
        role: newMemberRole
      }).unwrap();

      setMemberSuccess(`User invited successfully as ${newMemberRole}!`);
      setNewMemberEmail('');
      setNewMemberRole('Developer');
    } catch (err) {
      setMemberError(err.data?.message || 'Failed to add member to project');
    }
  };

  const isLoading = isProjectLoading || isTasksLoading || isSprintsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors animate-pulse">
        <div className="text-lg font-semibold text-slate-600 dark:text-slate-400">Loading project...</div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors p-6 text-center">
        <h2 className="text-2xl font-bold text-danger mb-2">Error Loading Project</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{(projectError && 'data' in projectError ? projectError.data?.message : 'Project not found.')}</p>
        <Link to="/" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header Panel */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex flex-wrap justify-between items-center gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition flex items-center gap-1">
            <ArrowLeft size={18} /> Back
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-none">{project.title}</h1>
            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${
              project.projectType === 'Scrum' 
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' 
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
            }`}>
              {project.projectType || 'Kanban'}
            </span>
          </div>
        </div>

        {/* View Mode Switching Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('board')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'board'
                ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            Board View
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'dashboard'
                ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            Metrics Dashboard
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMemberModalOpen(true)}
            className="border border-slate-350 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition text-xs"
          >
            <Users size={15} /> Members ({1 + (project.members?.length || 0)})
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/10 transition text-xs"
          >
            <Plus size={15} /> Add Task
          </button>
        </div>
      </nav>

      {/* Main Board View Container */}
      <main className="flex-1 overflow-hidden">
        {viewMode === 'dashboard' ? (
          <ProjectDashboard project={project} tasks={tasks} sprints={sprints} />
        ) : (
          <BoardFactory
            project={project}
            tasks={tasks}
            sprints={sprints}
            onDeleteTask={deleteTask}
            onOpenTask={setSelectedTask}
            onCreateTask={createTask}
            onUpdateTask={updateTask}
            onDragEnd={handleDragEnd}
            onCreateSprint={createSprint}
            onUpdateSprint={updateSprint}
            onDeleteSprint={deleteSprint}
          />
        )}
      </main>

      {/* Detail view modal for a selected task */}
      {selectedTask && (
        <IssueView 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={(updatedTask) => {
            // Optimistic update handler
            setSelectedTask(updatedTask);
          }} 
        />
      )}

      {/* Quick Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl border border-slate-100 dark:border-slate-700 transition-colors">
            <h3 className="text-xl font-black mb-4 text-slate-800 dark:text-slate-100 uppercase tracking-wide">New Agile Task</h3>
            <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Task Title *"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-transparent dark:text-slate-100 text-sm font-semibold"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>

              {project.projectType === 'Scrum' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Type</label>
                    <select
                      value={newTaskIssueType}
                      onChange={(e) => setNewTaskIssueType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-650 rounded-xl bg-transparent dark:text-slate-100 text-xs font-semibold focus:ring-purple-500"
                    >
                      <option value="Epic">Epic</option>
                      <option value="Story">Story</option>
                      <option value="Task">Task</option>
                      <option value="Subtask">Subtask</option>
                      <option value="Bug">Bug</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Story Points</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-650 rounded-xl bg-transparent dark:text-slate-100 text-xs font-semibold focus:ring-purple-500"
                      value={newTaskStoryPoints}
                      onChange={(e) => setNewTaskStoryPoints(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="text-slate-400" size={18} />
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-transparent dark:text-slate-100 text-sm font-semibold"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Tag className="text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Labels (comma separated)"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-transparent dark:text-slate-100 text-sm font-semibold"
                  value={newTaskLabels}
                  onChange={(e) => setNewTaskLabels(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Checklist Items (comma separated)"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl focus:ring-purple-500 focus:border-purple-500 bg-transparent dark:text-slate-100 text-sm font-semibold"
                  value={newTaskChecklist}
                  onChange={(e) => setNewTaskChecklist(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold text-xs shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Invitation Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-700 transition-colors flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-150 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <Users className="text-purple-600" size={18} /> Project Membership
              </h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-slate-400 hover:text-slate-650 transition">
                <X size={18} />
              </button>
            </div>

            {/* Current Member List */}
            <div className="flex-1 overflow-y-auto mb-4 pr-1 space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Team Members ({1 + (project.members?.length || 0)})</h4>
              
              {/* Owner Display */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-slate-700/20 border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-850 dark:text-slate-100">{project.owner?.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{project.owner?.email}</p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded border border-purple-100">
                  Project Creator
                </span>
              </div>

              {/* Members Display */}
              {project.members && project.members.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{m.user?.name || 'Pending User'}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{m.user?.email}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-150 dark:border-slate-650">
                    {m.role || 'Developer'}
                  </span>
                </div>
              ))}
            </div>

            {/* Invite Form */}
            <form onSubmit={handleAddMemberSubmit} className="border-t border-slate-150 dark:border-slate-700 pt-4 space-y-3">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <UserPlus size={12} /> Invite Member
              </h4>
              
              {memberError && <p className="text-xs text-red-650 font-bold bg-red-50 p-2 rounded-lg border border-red-100">{memberError}</p>}
              {memberSuccess && <p className="text-xs text-green-650 font-bold bg-green-50 p-2 rounded-lg border border-green-100">{memberSuccess}</p>}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-650 rounded-xl bg-transparent dark:text-slate-100 text-xs font-semibold focus:ring-purple-500"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-650 rounded-xl bg-transparent dark:text-slate-100 text-xs font-semibold focus:ring-purple-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Scrum Master">Scrum Master</option>
                    <option value="Product Owner">Product Owner</option>
                    <option value="Developer">Developer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-105 rounded-xl font-bold text-xs transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
