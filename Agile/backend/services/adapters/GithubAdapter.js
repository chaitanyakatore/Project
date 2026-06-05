/**
 * Interface definition for Future MCP GitHub Integration.
 * Strictly adheres to SOLID Dependency Inversion Principle.
 */
class GithubAdapter {
  constructor() {
    this.name = 'GitHub';
  }

  /**
   * Connect to the GitHub REST/GraphQL API.
   * @param {string} personalAccessToken - Token for API actions
   */
  async connect(personalAccessToken) {
    throw new Error('connect method not implemented');
  }

  /**
   * Post a status comment on a pull request.
   * @param {string} repo - Repository name (e.g. "owner/repo")
   * @param {number} prNumber - Pull request sequence ID
   * @param {string} body - Comment markdown content
   */
  async createPRComment(repo, prNumber, body) {
    throw new Error('createPRComment method not implemented');
  }

  /**
   * Sync issue states between GitHub Issues and Task records.
   * @param {string} gitHubIssueId - GitHub issue ID
   * @param {string} internalTaskId - Local DB task ID
   */
  async syncIssue(gitHubIssueId, internalTaskId) {
    throw new Error('syncIssue method not implemented');
  }
}

export default GithubAdapter;
