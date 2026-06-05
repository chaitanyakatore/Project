import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2, Calendar, Play, Plus, AlertCircle, PlusCircle, CheckSquare, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';
import { useGetSprintMetricsQuery } from '../../services/apiSlice';

const priorityColors = {
  Low: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  High: 'bg-red-50 text-red-700 border-red-200',
  Critical: 'bg-red-100 text-red-800 border-red-300 font-extrabold animate-pulse'
};

const BacklogView = ({
  tasks,
  sprints,
  onCreateSprint,
  onUpdateSprint,
  onDeleteSprint,
  onCreateTask,
  onDeleteTask,
  onOpenTask,
  onDragEnd,
  onStartSprint
}) => {
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [sprintStartDate, setSprintStartDate] = useState('');
  const [sprintEndDate, setSprintEndDate] = useState('');

  const [newBacklogTaskTitle, setNewBacklogTaskTitle] = useState('');

  // Handle Sprint Creation
  const handleCreateSprintSubmit = async (e) => {
    e.preventDefault();
    if (!sprintName) return;
    try {
      await onCreateSprint({
        name: sprintName,
        goal: sprintGoal,
        startDate: sprintStartDate || undefined,
        endDate: sprintEndDate || undefined
      });
      setSprintName('');
      setSprintGoal('');
      setSprintStartDate('');
      setSprintEndDate('');
      setIsSprintModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create sprint');
    }
  };

  // Handle Quick Task Creation in Backlog
  const handleAddBacklogTask = async (e) => {
    e.preventDefault();
    if (!newBacklogTaskTitle) return;
    try {
      await onCreateTask({
        title: newBacklogTaskTitle,
        status: 'To Do',
        priority: 'Medium',
        sprint: null
      });
      setNewBacklogTaskTitle('');
    } catch (err) {
      alert(err.message || 'Failed to add task');
    }
  };

  // Group tasks
  const backlogTasks = tasks.filter((t) => t.sprint === null).sort((a, b) => a.position - b.position);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-full overflow-y-auto bg-slate-100/40">
      {/* Sprints and Backlog planning list */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="text-purple-600" /> Sprint Backlog Planning
          </h2>
          <button
            onClick={() => setIsSprintModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-700 shadow-md transition text-xs"
          >
            <Plus size={16} /> Create Sprint
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {/* Sprints List */}
          <div className="space-y-4">
            {sprints.map((sprint) => {
              const sprintTasks = tasks
                .filter((t) => t.sprint === sprint._id)
                .sort((a, b) => a.position - b.position);

              return (
                <SprintPanel
                  key={sprint._id}
                  sprint={sprint}
                  tasks={sprintTasks}
                  onStartSprint={onStartSprint}
                  onDeleteSprint={onDeleteSprint}
                  onDeleteTask={onDeleteTask}
                  onOpenTask={onOpenTask}
                />
              );
            })}
          </div>

          {/* Backlog List */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-colors mt-6">
            <div className="bg-slate-50/50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                Product Backlog
                <span className="bg-slate-200/70 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {backlogTasks.length} Issues
                </span>
              </h3>
            </div>

            <Droppable droppableId="backlog">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 min-h-[150px] space-y-2 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-slate-100/50' : ''
                  }`}
                >
                  {backlogTasks.map((task, index) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      index={index}
                      onDelete={onDeleteTask}
                      onOpen={onOpenTask}
                    />
                  ))}
                  {backlogTasks.length === 0 && (
                    <div className="text-center text-sm text-slate-400 py-10">
                      Backlog is empty. Add a task below or drag a task here.
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Quick add backlog task */}
            <form onSubmit={handleAddBacklogTask} className="p-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Write item title & press enter..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-transparent text-slate-800 font-semibold"
                value={newBacklogTaskTitle}
                onChange={(e) => setNewBacklogTaskTitle(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 rounded-xl hover:bg-purple-750 transition shadow-sm font-bold text-xs flex items-center gap-1"
              >
                <PlusCircle size={14} /> Add Task
              </button>
            </form>
          </div>
        </DragDropContext>
      </div>

      {/* Create Sprint Modal */}
      {isSprintModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Create Sprint</h3>
            <form onSubmit={handleCreateSprintSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Sprint Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sprint 1"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-transparent text-slate-800 text-sm font-semibold"
                  value={sprintName}
                  onChange={(e) => setSprintName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Sprint Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Deliver authentication suite"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-transparent text-slate-800 text-sm font-semibold"
                  value={sprintGoal}
                  onChange={(e) => setSprintGoal(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-transparent text-slate-800 text-sm font-semibold"
                    value={sprintStartDate}
                    onChange={(e) => setSprintStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-transparent text-slate-800 text-sm font-semibold"
                    value={sprintEndDate}
                    onChange={(e) => setSprintEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsSprintModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-sm font-bold text-sm"
                >
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent that manages and displays individual Sprint Details & Real-Time Metrics (SOLID SRP)
const SprintPanel = ({
  sprint,
  tasks,
  onStartSprint,
  onDeleteSprint,
  onDeleteTask,
  onOpenTask
}) => {
  const { data: metrics, isLoading, isError } = useGetSprintMetricsQuery(sprint._id);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-300">
      {/* Header Container */}
      <div className="bg-slate-50/50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">{sprint.name}</h3>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                sprint.status === 'Active'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : sprint.status === 'Completed'
                  ? 'bg-slate-100 text-slate-500 border border-slate-200'
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}
            >
              {sprint.status}
            </span>
          </div>
          {sprint.goal && (
            <p className="text-xs text-slate-500 mt-1 italic font-semibold">Goal: {sprint.goal}</p>
          )}
          {(sprint.startDate || sprint.endDate) && (
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-bold">
              <Calendar size={12} />
              {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString() : 'N/A'} -{' '}
              {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : 'N/A'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {sprint.status === 'Planned' && (
            <button
              onClick={() => onStartSprint(sprint._id)}
              className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-green-700 transition flex items-center gap-1 shadow-sm"
            >
              <Play size={12} /> Start Sprint
            </button>
          )}
          <button
            onClick={() => onDeleteSprint(sprint._id)}
            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Metrics Row (Sprints capacity summaries) */}
      {!isLoading && !isError && metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-50/20 border-b border-slate-100 p-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <BarChart3 size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sprint Progress</p>
              <p className="text-sm font-black text-slate-800">{metrics.sprintProgress}% ({metrics.completedTasks}/{metrics.totalTasks})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
              <p className="text-sm font-black text-slate-800">{metrics.storyCompletionRate}% SP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining SP</p>
              <p className="text-sm font-black text-slate-800">{metrics.remainingStoryPoints} SP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <CheckSquare size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Velocity</p>
              <p className="text-sm font-black text-slate-800">{metrics.velocity} SP</p>
            </div>
          </div>
        </div>
      )}

      {/* Droppable Task rows */}
      <Droppable droppableId={sprint._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[60px] space-y-2 transition-colors ${
              snapshot.isDraggingOver ? 'bg-slate-100/50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskRow
                key={task._id}
                task={task}
                index={index}
                onDelete={onDeleteTask}
                onOpen={onOpenTask}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-3 font-semibold">
                Drag and drop tasks here to plan this sprint.
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

// Sub-component for individual task row inside BacklogView
const TaskRow = ({ task, index, onDelete, onOpen }) => {
  const completedChecks = task.checklist ? task.checklist.filter((c) => c.isCompleted).length : 0;
  const totalChecks = task.checklist ? task.checklist.length : 0;

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpen(task)}
          className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
            snapshot.isDragging
              ? 'bg-slate-55 shadow-lg border-purple-500'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                task.issueType === 'Bug'
                  ? 'bg-red-50 text-red-700 border-red-100'
                  : task.issueType === 'Story'
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : task.issueType === 'Epic'
                  ? 'bg-purple-50 text-purple-700 border-purple-100'
                  : 'bg-blue-50 text-blue-700 border-blue-100'
              }`}
            >
              {task.issueType || 'Task'}
            </span>
            <span className="font-bold text-sm text-slate-700 truncate">
              {task.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {task.storyPoints > 0 && (
              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                {task.storyPoints} SP
              </span>
            )}
            <span
              className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${
                priorityColors[task.priority] || priorityColors.Medium
              }`}
            >
              {task.priority}
            </span>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {task.status}
            </span>
            {totalChecks > 0 && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                <CheckSquare size={10} /> {completedChecks}/{totalChecks}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-50 transition"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BacklogView;
