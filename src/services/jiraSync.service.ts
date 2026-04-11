export enum JiraPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Highest',
}

export enum JiraIssueType {
  STORY = 'Story',
  BUG = 'Bug',
  TASK = 'Task',
}

export class JiraTransformer {
  static toJiraIssue(story: any) {
    return {
      fields: {
        summary: story.title,
        description: story.description,
        issuetype: { name: this.mapType(story.type) },
        priority: { name: this.mapPriority(story.priority) },
        // Campos personalizados mapeados en spec
        customfield_10001: story.acceptanceCriteria, // acceptanceCriteria
        customfield_10002: story.storyPoints,      // storyPoints
      }
    };
  }

  private static mapPriority(p: string): JiraPriority {
    switch (p) {
      case 'critical': return JiraPriority.CRITICAL;
      case 'high': return JiraPriority.HIGH;
      case 'medium': return JiraPriority.MEDIUM;
      default: return JiraPriority.LOW;
    }
  }

  private static mapType(t: string): JiraIssueType {
    switch (t) {
      case 'bug': return JiraIssueType.BUG;
      case 'task': return JiraIssueType.TASK;
      default: return JiraIssueType.STORY;
    }
  }
}

export class JiraMCPClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.JIRA_MCP_URL || 'http://localhost:8080';
  }

  async syncIssue(issueData: any): Promise<{ key: string }> {
    console.log(`[JiraMCP] Syncing issue to ${this.baseUrl}...`);
    
    // Simulación de llamada a MCP (MCP suele exponer herramientas vía JSON-RPC o HTTP)
    const response = await fetch(`${this.baseUrl}/tools/create-issue`, {
      method: 'POST',
      body: JSON.stringify(issueData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error('Jira MCP Communication Failed');

    return response.json();
  }
}
