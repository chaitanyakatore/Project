/**
 * Interface definition for Future MCP Slack Integration.
 * Strictly adheres to SOLID Dependency Inversion Principle.
 */
class SlackAdapter {
  constructor() {
    this.name = 'Slack';
  }

  /**
   * Connect to the Slack Web Client / Socket Mode.
   * @param {string} botToken - Slack bot API token
   */
  async connect(botToken) {
    throw new Error('connect method not implemented');
  }

  /**
   * Post a notification message to a specific channel.
   * @param {string} channelId - Channel ID name or ID
   * @param {string} text - Message content
   * @param {Object} attachments - Rich layouts / blocks
   */
  async postMessage(channelId, text, attachments = {}) {
    throw new Error('postMessage method not implemented');
  }

  /**
   * Listen for user commands / mentions on Slack.
   * @param {string} eventName - Slack event name
   * @param {Function} callback - Trigger callback
   */
  async subscribeToEvents(eventName, callback) {
    throw new Error('subscribeToEvents method not implemented');
  }
}

export default SlackAdapter;
