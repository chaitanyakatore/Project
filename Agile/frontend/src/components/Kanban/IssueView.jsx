import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X, MessageSquare, Send } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const IssueView = ({ task, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [description, setDescription] = useState(task.description || '');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [localTask, setLocalTask] = useState(task);

  useEffect(() => {
    fetchComments();
  }, [task._id]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/task/${task._id}`);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (field, value) => {
    setLocalTask(prev => ({ ...prev, [field]: value }));
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { [field]: value });
      onUpdate(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDescriptionSave = async () => {
    handleUpdate('description', description);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post(`/comments/task/${task._id}`, { text: newComment });
      setComments([...comments, data]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 px-2 py-0.5 rounded">
              {localTask.issueType || 'Task'}
            </span>
            <input
              type="text"
              value={localTask.title}
              onChange={(e) => setLocalTask(prev => ({...prev, title: e.target.value}))}
              onBlur={(e) => handleUpdate('title', e.target.value)}
              className="text-2xl font-bold bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 w-[500px]"
            />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Description</h3>
              <div className="prose dark:prose-invert max-w-none mb-2">
                <ReactQuill 
                  theme="snow" 
                  value={description} 
                  onChange={setDescription} 
                  className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg overflow-hidden"
                />
              </div>
              <button 
                onClick={handleDescriptionSave}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
              >
                Save Description
              </button>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <MessageSquare size={20} /> Activity & Comments
              </h3>
              
              <div className="space-y-4 mb-6">
                {comments.map(comment => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                      {comment.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{comment.author.name}</span>
                        <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 text-sm">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-slate-500 text-sm italic">No comments yet.</p>}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary bg-transparent dark:text-slate-100 text-sm"
                />
                <button type="submit" className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center gap-2">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
              <select 
                value={localTask.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm dark:text-slate-100"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Priority</label>
              <select 
                value={localTask.priority}
                onChange={(e) => handleUpdate('priority', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm dark:text-slate-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Issue Type</label>
              <select 
                value={localTask.issueType || 'Task'}
                onChange={(e) => handleUpdate('issueType', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm dark:text-slate-100"
              >
                <option value="Task">Task</option>
                <option value="Story">Story</option>
                <option value="Bug">Bug</option>
                <option value="Epic">Epic</option>
              </select>
            </div>

            {localTask.assignee && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assignee</label>
                <div className="flex items-center gap-2 text-sm dark:text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    {localTask.assignee.name.charAt(0)}
                  </div>
                  {localTask.assignee.name}
                </div>
              </div>
            )}

            {localTask.reporter && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Reporter</label>
                <div className="flex items-center gap-2 text-sm dark:text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                    {localTask.reporter.name.charAt(0)}
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
