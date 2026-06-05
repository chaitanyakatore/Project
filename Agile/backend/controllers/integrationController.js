import appEventEmitter from '../utils/eventEmitter.js';

export const handleGithubWebhook = async (req, res) => {
  try {
    const { action, pull_request } = req.body;
    
    console.log(`[Webhook Received] GitHub action: ${action}`);

    // Check if it's a pull request merge event
    if (action === 'closed' && pull_request?.merged) {
      const prTitle = pull_request.title;
      const prBody = pull_request.body || '';
      
      // Parse potential task ID from branch name or PR description (e.g., "Closes #6a232...")
      const idMatch = prTitle.match(/#([a-fA-F0-9]{24})/) || prBody.match(/#([a-fA-F0-9]{24})/);
      const taskId = idMatch ? idMatch[1] : null;

      console.log(`[Webhook PR Merged] Title: "${prTitle}", Parsed Task ID: ${taskId}`);

      // Emit event onto the Event Bus
      appEventEmitter.emit('GITHUB_PR_MERGED', {
        prTitle,
        prBody,
        taskId,
        mergedBy: pull_request.user?.login || 'github-actor'
      });
      
      return res.json({ message: 'Webhook processed, event emitted', taskId });
    }

    res.json({ message: 'Webhook ignored (not a merged PR)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
