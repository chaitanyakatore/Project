import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, MessageSquare, Send, Trash2, Calendar, UserPlus, CheckSquare, Plus, Star } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const priorityColors = {
  Low: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  High: 'bg-red-50 text-red-700 border-red-200',
  Critical: 'bg-red-100 text-red-800 border-red-300 font-extrabold animate-pulse'
};

const IssueView = ({ task, onClose, onUpdate }) => {
  const { user: currentUser } = useAuth();
  const [description, setDescription] = useState(task.description || '');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [localTask, setLocalTask] = useState(task);
  const [projectMembers, setProjectMembers] = useState([]);

  // Checklist Items State
  const [checklistItems, setChecklistItems] = useState(task.checklist || []);
  const [newCheckItemText, setNewCheckItemText] = useState('');

  useEffect(() => {
    fetchComments();
    fetchProjectMembers();
  }, [task._id]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/task/${task._id}`);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      const { data } = await api.get(`/projects/${task.project}`);
      const members = [];
      if (data.owner) {
        members.push({ _id: data.owner._id || data.owner, name: `${data.owner.name} (Owner)` });
      }
      if (data.members) {
        data.members.forEach(m => {
          if (m.user && m.user._id) {
            members.push({ _id: m.user._id, name: m.user.name });
          }
        });
      }
      setProjectMembers(members);
    } catch (error) {
      console.error('Failed to load project members for assignee selection', error);
    }
  };

  const handleUpdate = async (field, value) => {
    setLocalTask(prev => ({ ...prev, [field]: value }));
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { [field]: value });
      onUpdate(data);
    } catch (error) {
      console.error('Failed to update task field', error);
    }
  };

  const handleDescriptionSave = async () => {
    handleUpdate('description', description);
    alert('Description updated successfully!');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post(`/comments/task/${task._id}`, { text: newComment });
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
      } catch (error) {
        console.error('Failed to delete comment', error);
      }
    }
  };

  // Checklist actions
  const toggleCheckItem = async (index) => {
    const updated = checklistItems.map((item, idx) => 
      idx === index ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setChecklistItems(updated);
    handleUpdate('checklist', updated);
  };

  const addChecklistItem = async (e) => {
    e.preventDefault();
    if (!newCheckItemText.trim()) return;
    const updated = [...checklistItems, { text: newCheckItemText.trim(), isCompleted: false }];
    setChecklistItems(updated);
    setNewCheckItemText('');
    handleUpdate('checklist', updated);
  };

  const deleteChecklistItem = async (index) => {
    const updated = checklistItems.filter((_, idx) => idx !== index);
    setChecklistItems(updated);
    handleUpdate('checklist', updated);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
              localTask.issueType === 'Bug' ? 'bg-red-50 text-red-700 border-red-100' :
              localTask.issueType === 'Story' ? 'bg-green-50 text-green-700 border-green-100' :
              localTask.issueType === 'Epic' ? 'bg-purple-50 text-purple-700 border-purple-100' :
              'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
              {localTask.issueType || 'Task'}
            </span>
            <input
              type="text"
              value={localTask.title}
              onChange={(e) => setLocalTask(prev => ({...prev, title: e.target.value}))}
              onBlur={(e) => handleUpdate('title', e.target.value)}
              className="text-lg font-extrabold bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 w-[400px] focus:outline-none"
            />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="md:col-span-2 space-y-8">
            {/* Description Editor */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Description
              </h3>
              <div className="prose max-w-none mb-3 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <ReactQuill 
                  theme="snow" 
                  value={description} 
                  onChange={setDescription} 
                  className="bg-white text-slate-800"
                />
              </div>
              <button 
                onClick={handleDescriptionSave}
                className="bg-purple-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-purple-700 transition shadow-sm"
              >
                Save Description
              </button>
            </div>

            {/* Checklist / Subtasks Section */}
            <div className="bg-slate-50/40 border border-slate-200/60 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckSquare size={16} /> Subtask Checklist
              </h3>
              
              <div className="space-y-2 mb-4">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 border border-slate-250 rounded-xl shadow-xs">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => toggleCheckItem(idx)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className={item.isCompleted ? 'line-through text-slate-400' : ''}>{item.text}</span>
                    </label>
                    <button
                      onClick={() => deleteChecklistItem(idx)}
                      className="text-slate-400 hover:text-red-600 transition p-1 hover:bg-slate-50 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {checklistItems.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No subtask checklists defined.</p>
                )}
              </div>

              <form onSubmit={addChecklistItem} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add checklist subtask..."
                  value={newCheckItemText}
                  onChange={(e) => setNewCheckItemText(e.target.value)}
                  className="flex-1 px-3 py-1 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 font-semibold bg-white"
                />
                <button type="submit" className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1">
                  <Plus size={12} /> Add
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare size={16} /> Activity Logs & Comments
              </h3>
              
              <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto pr-2">
                {comments.map(comment => (
                  <div key={comment._id} className="flex gap-3 bg-slate-50/50 p-3 border border-slate-200/50 rounded-2xl shadow-xs">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm border border-purple-100 shrink-0">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-700 text-xs">{comment.author.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                        {comment.text}
                      </p>
                    </div>
                    {currentUser && comment.author && currentUser._id.toString() === (comment.author._id || comment.author).toString() && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-slate-400 hover:text-red-600 p-1 hover:bg-slate-100 rounded self-start transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
                {comments.length === 0 && <p className="text-slate-400 text-xs italic">No comments written yet.</p>}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or post progress updates..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-semibold"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-750 text-white px-4 rounded-xl font-bold text-xs transition flex items-center gap-1 shadow-xs">
                  <Send size={12} /> Post Comment
                </button>
              </form>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="bg-slate-50 border border-slate-200/70 p-5 rounded-2xl space-y-5 flex flex-col justify-start">
            {/* Status Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
              <select 
                value={localTask.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              >
                <option value="Backlog">Backlog</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Code Review">Code Review</option>
                <option value="Testing">Testing</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
              <select 
                value={localTask.priority}
                onChange={(e) => handleUpdate('priority', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Issue Type Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Type</label>
              <select 
                value={localTask.issueType || 'Task'}
                onChange={(e) => handleUpdate('issueType', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              >
                <option value="Epic">Epic</option>
                <option value="Story">Story</option>
                <option value="Task">Task</option>
                <option value="Subtask">Subtask</option>
                <option value="Bug">Bug</option>
              </select>
            </div>

            {/* Story Points input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Story Points (Capacity)</label>
              <input
                type="number"
                min="0"
                value={localTask.storyPoints || 0}
                onChange={(e) => handleUpdate('storyPoints', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Due Date Picker */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={10} /> Due Date
              </label>
              <input
                type="date"
                value={localTask.dueDate ? new Date(localTask.dueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleUpdate('dueDate', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Assignee Selector Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</label>
              <select
                value={localTask.assignee ? (localTask.assignee._id || localTask.assignee) : ''}
                onChange={(e) => handleUpdate('assignee', e.target.value || null)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Unassigned</option>
                {projectMembers.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Reporter Display */}
            {localTask.reporter && (
              <div className="pt-2 border-t border-slate-200/60">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reporter</label>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black">
                    {localTask.reporter.name ? localTask.reporter.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {localTask.reporter.name}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueView;
