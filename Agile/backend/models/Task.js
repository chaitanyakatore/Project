import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: Date },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }, // null means it's in the backlog
  epic: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, // self-reference to an Epic task
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issueType: { type: String, enum: ['Epic', 'Story', 'Task', 'Bug'], default: 'Task' },
  position: { type: Number, default: 0 }, // Used for custom ordering in columns
  labels: [{ type: String }],
  checklist: [{ text: String, isCompleted: { type: Boolean, default: false } }]
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
