import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

attachmentSchema.index({ task: 1 });

export default mongoose.model('Attachment', attachmentSchema);
