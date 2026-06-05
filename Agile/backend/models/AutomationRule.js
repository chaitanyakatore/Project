import mongoose from 'mongoose';

const automationRuleSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  triggerEvent: { type: String, required: true }, // e.g. "TASK_STATUS_UPDATED", "TASK_ASSIGNED", "GITHUB_PR_MERGED"
  condition: { type: mongoose.Schema.Types.Mixed }, // e.g. { field: "status", equals: "Testing" }
  actionType: { type: String, required: true }, // e.g. "MOVE_TASK", "SEND_NOTIFICATION"
  actionParams: { type: mongoose.Schema.Types.Mixed }, // e.g. { newStatus: "Done" }
  active: { type: Boolean, default: true }
}, { timestamps: true });

automationRuleSchema.index({ project: 1, triggerEvent: 1 });

export default mongoose.model('AutomationRule', automationRuleSchema);
