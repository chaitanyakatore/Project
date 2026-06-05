import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  action: { type: String, required: true }, // e.g. "STATUS_CHANGED", "TASK_CREATED"
  details: { type: mongoose.Schema.Types.Mixed } // e.g. { oldStatus: "To Do", newStatus: "In Progress" }
}, { timestamps: true });

// Optimize indexing for fast timeline loading
activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ task: 1 });

export default mongoose.model('ActivityLog', activityLogSchema);
