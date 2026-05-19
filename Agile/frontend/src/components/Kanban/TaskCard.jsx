import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, Clock, AlertCircle, CheckSquare, Tag } from 'lucide-react';

const priorityColors = {
  Low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  High: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
};

const TaskCard = ({ task, index, onDelete, onOpen }) => {
  const completedChecks = task.checklist ? task.checklist.filter(c => c.isCompleted).length : 0;
  const totalChecks = task.checklist ? task.checklist.length : 0;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpen(task)}
          className={`p-4 rounded-xl shadow-sm mb-3 border cursor-pointer ${
            snapshot.isDragging 
              ? 'shadow-lg border-primary rotate-1 bg-white dark:bg-slate-700' 
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md bg-white dark:bg-slate-800'
          } transition-all relative group`}
        >
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.map((label, idx) => (
                <span key={idx} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Tag size={10} /> {label}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-slate-800 dark:text-slate-100 font-medium">{task.title}</h4>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
              className="text-slate-400 dark:text-slate-500 hover:text-danger dark:hover:text-danger opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="flex items-center flex-wrap gap-2 mt-4">
            <span
              className={`text-xs px-2 py-1 rounded-md border flex items-center gap-1 ${
                priorityColors[task.priority] || priorityColors.Medium
              }`}
            >
              <AlertCircle size={12} /> {task.priority}
            </span>
            {totalChecks > 0 && (
              <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${completedChecks === totalChecks ? 'bg-success/10 text-success' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                <CheckSquare size={12} /> {completedChecks}/{totalChecks}
              </span>
            )}
            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md ${isOverdue ? 'bg-danger/10 text-danger' : 'text-slate-500 dark:text-slate-400'}`}>
                <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
