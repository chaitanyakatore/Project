import AutomationRule from '../models/AutomationRule.js';

class AutomationRuleRepository {
  async findByProject(projectId) {
    return await AutomationRule.find({ project: projectId });
  }

  async findByTrigger(projectId, triggerEvent) {
    return await AutomationRule.find({ project: projectId, triggerEvent, active: true });
  }

  async create(ruleData) {
    const rule = new AutomationRule(ruleData);
    return await rule.save();
  }

  async findById(id) {
    return await AutomationRule.findById(id);
  }

  async save(rule) {
    return await rule.save();
  }

  async delete(id) {
    return await AutomationRule.findByIdAndDelete(id);
  }
}

export default new AutomationRuleRepository();
