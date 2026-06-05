import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Admin', 'Scrum Master', 'Product Owner', 'Developer', 'Viewer'], default: 'Developer' }
  }],
  projectType: { type: String, enum: ['Kanban', 'Scrum'], default: 'Kanban' }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
