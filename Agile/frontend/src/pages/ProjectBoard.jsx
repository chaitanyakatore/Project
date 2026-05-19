import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Column from '../components/Kanban/Column';
import IssueView from '../components/Kanban/IssueView';
import { ArrowLeft, Plus, Moon, Sun, Calendar, Tag, CheckSquare } from 'lucide-react';

const columnsInit = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Done', title: 'Done' }
];

const ProjectBoard = () => {
  const { id: projectId } = useParams();
  const { isDarkMode, toggleTheme } = useTheme();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskLabels, setNewTaskLabels] = useState('');
  const [newTaskChecklist, setNewTaskChecklist] = useState('');

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskToMove = tasks.find((t) => t._id === draggableId);
    
    // Optimistic UI Update
    const newTasks = Array.from(tasks);
    
    // Remove from source
    const sourceTasks = newTasks.filter(t => t.status === source.droppableId).sort((a,b) => a.position - b.position);
    sourceTasks.splice(source.index, 1);
    
    // Add to destination
    const destTasks = newTasks.filter(t => t.status === destination.droppableId).sort((a,b) => a.position - b.position);
    // filter out the dragged task from destTasks just in case
    const filteredDestTasks = destTasks.filter(t => t._id !== draggableId);
    filteredDestTasks.splice(destination.index, 0, taskToMove);

    // Calculate new position
    let newPosition = 1024;
    if (filteredDestTasks.length === 1) {
      newPosition = 1024; // Only item
    } else if (destination.index === 0) {
      newPosition = filteredDestTasks[1].position / 2; // First item
    } else if (destination.index === filteredDestTasks.length - 1) {
      newPosition = filteredDestTasks[filteredDestTasks.length - 2].position + 1024; // Last item
    } else {
      const prevPos = filteredDestTasks[destination.index - 1].position;
      const nextPos = filteredDestTasks[destination.index + 1].position;
      newPosition = (prevPos + nextPos) / 2; // Middle item
    }

    const updatedTask = { ...taskToMove, status: destination.droppableId, position: newPosition };
    
    // Reconstruct state
    setTasks(prevTasks => prevTasks.map(t => t._id === updatedTask._id ? updatedTask : t));

    // Server update
    try {
      await api.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
        position: newPosition
      });
    } catch (error) {
      console.error('Failed to update task', error);
      fetchTasks(); // Revert on failure
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      const labelsArray = newTaskLabels.split(',').map(l => l.trim()).filter(l => l);
      const checklistArray = newTaskChecklist.split(',').map(c => ({ text: c.trim(), isCompleted: false })).filter(c => c.text);

      await api.post(`/tasks/project/${projectId}`, {
        title: newTaskTitle,
        status: 'To Do',
        priority: 'Medium',
        dueDate: newTaskDueDate || undefined,
        labels: labelsArray,
        checklist: checklistArray
      });
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskLabels('');
      setNewTaskChecklist('');
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  if (!project) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition flex items-center gap-1">
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-500 hover:text-primary dark:text-slate-400 transition">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 shadow-md transition text-sm"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {columnsInit.map((column) => {
              const columnTasks = tasks
                .filter((t) => t.status === column.id)
                .sort((a, b) => a.position - b.position);
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onDelete={handleDeleteTask}
                  onOpen={setSelectedTask}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>

      {selectedTask && (
        <IssueView 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={(updatedTask) => {
            setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
            setSelectedTask(updatedTask);
          }} 
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Task Title *"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary focus:border-primary bg-transparent dark:text-slate-100"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-slate-400" size={20} />
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary focus:border-primary bg-transparent dark:text-slate-100"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Tag className="text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Labels (comma separated)"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary focus:border-primary bg-transparent dark:text-slate-100"
                  value={newTaskLabels}
                  onChange={(e) => setNewTaskLabels(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Checklist Items (comma separated)"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary focus:border-primary bg-transparent dark:text-slate-100"
                  value={newTaskChecklist}
                  onChange={(e) => setNewTaskChecklist(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
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

export default ProjectBoard;
