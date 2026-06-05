/**
 * Interface definition for Future MCP Gmail Integration.
 * Strictly adheres to SOLID Dependency Inversion Principle.
 */
class GmailAdapter {
  constructor() {
    this.name = 'Gmail';
  }

  /**
   * Connect to the Gmail API service.
   * @param {Object} authCredentials - Credentials for OAuth flow
   */
  async connect(authCredentials) {
    throw new Error('connect method not implemented');
  }

  /**
   * Send an automated email notification.
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email HTML or plaintext body
   */
  async sendEmail(to, subject, body) {
    throw new Error('sendEmail method not implemented');
  }

  /**
   * Fetch recent messages from a thread (e.g., ticket replies).
   * @param {string} threadId - Gmail thread ID
   */
  async getReplies(threadId) {
    throw new Error('getReplies method not implemented');
  }
}

export default GmailAdapter;
