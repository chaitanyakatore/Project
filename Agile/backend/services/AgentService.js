import appEventEmitter from '../utils/eventEmitter.js';
import TaskService from './TaskService.js';
import SprintService from './SprintService.js';

class AgentService {
  constructor() {
    this.toolRegistry = new Map();
    this.actionRegistry = new Map();
    this.agentEventBuffer = [];

    // Initialize Tool Registry (AI Agent accessible capabilities)
    this.initDefaultTools();

    // Initialize Event Listener Layer (Agent listens to platform activities)
    this.initEventListener();
  }

  // Registers tools that Agents can discover and execute
  registerTool(name, description, parameterSchema, executeFn) {
    this.toolRegistry.set(name, {
      name,
      description,
      parameterSchema,
      executeFn
    });
    console.log(`[Agent Registry] Tool registered: ${name}`);
  }

  // Executes a tool from the Agent layer (strictly bypassing direct DB access)
  async executeTool(name, params, userId) {
    const tool = this.toolRegistry.get(name);
    if (!tool) {
      throw new Error(`Tool '${name}' not found in Agent Registry.`);
    }

    console.log(`[Agent Execution] Executing tool: ${name} with params:`, params);

    // Track in Action Registry for auditing
    const actionId = `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.actionRegistry.set(actionId, {
      toolName: name,
      params,
      userId,
      timestamp: new Date(),
      status: 'PENDING'
    });

    try {
      const result = await tool.executeFn(params, userId);
      this.actionRegistry.set(actionId, {
        ...this.actionRegistry.get(actionId),
        status: 'SUCCESS',
        result
      });
      return result;
    } catch (err) {
      this.actionRegistry.set(actionId, {
        ...this.actionRegistry.get(actionId),
        status: 'FAILED',
        error: err.message
      });
      throw err;
    }
  }

  // Get list of all registered tools (useful for LLM function calling / tools array)
  getAvailableTools() {
    return Array.from(this.toolRegistry.values()).map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameterSchema
    }));
  }

  // Initialize tool capability mappings
  initDefaultTools() {
    // 1. Tool: Move Ticket
    this.registerTool(
      'moveTicket',
      'Moves a task status to another stage (e.g. To Do -> In Progress)',
      {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: 'ID of the task to update' },
          status: { type: 'string', description: 'Target status column name' }
        },
        required: ['taskId', 'status']
      },
      async (params, userId) => {
        return await TaskService.updateTask(params.taskId, { status: params.status }, userId);
      }
    );

    // 2. Tool: Assign Ticket
    this.registerTool(
      'assignTicket',
      'Assigns a task to a developer',
      {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: 'ID of the task' },
          assigneeId: { type: 'string', description: 'ID of the assignee user' }
        },
        required: ['taskId', 'assigneeId']
      },
      async (params, userId) => {
        return await TaskService.updateTask(params.taskId, { assignee: params.assigneeId }, userId);
      }
    );

    // 3. Tool: Get Sprint Report
    this.registerTool(
      'getSprintReport',
      'Generates performance metrics and remaining work for a sprint',
      {
        type: 'object',
        properties: {
          sprintId: { type: 'string', description: 'ID of the sprint' }
        },
        required: ['sprintId']
      },
      async (params) => {
        return await SprintService.getSprintMetrics(params.sprintId);
      }
    );
  }

  // Event Listener Layer - collects real-time event feeds for Agents to consume
  initEventListener() {
    const events = ['TASK_CREATED', 'TASK_STATUS_UPDATED', 'TASK_ASSIGNEE_UPDATED', 'TASK_DELETED'];
    events.forEach(event => {
      appEventEmitter.on(event, (data) => {
        const agentFeed = {
          eventId: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          type: event,
          payload: data,
          timestamp: new Date()
        };
        // Buffer events for agents to pull/process (e.g., in a message queue structure)
        this.agentEventBuffer.push(agentFeed);
        if (this.agentEventBuffer.length > 500) {
          this.agentEventBuffer.shift(); // Keep buffer sized
        }
      });
    });
  }

  // Agent pulls event feeds to perform automatic tasks
  getEventFeed() {
    return this.agentEventBuffer;
  }
}

export default new AgentService();
