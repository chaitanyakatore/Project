import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['Assignment', 'Comment', 'Mention', 'StatusUpdate'], required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
