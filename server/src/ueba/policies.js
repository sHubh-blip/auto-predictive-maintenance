// Simple policy mapping agents to route prefixes they are allowed to access
export const policies = {
  MasterAgent: ['/api/orchestrator', '/api/scheduling', '/api/vehicles', '/api/ueba'],
  DataAnalysisAgent: ['/api/vehicles'],
  DiagnosisAgent: ['/api/vehicles'],
  SchedulingAgent: ['/api/scheduling'],
  CustomerEngagementAgent: ['/api/orchestrator'],
  FeedbackAgent: ['/api/vehicles'],
  ManufacturingInsightsAgent: ['/api/ueba'],
  UserUI: ['/api', '/health']
};

export function isAllowed(agent, path) {
  const allowed = policies[agent] || [];
  return allowed.some((prefix) => path.startsWith(prefix));
}
