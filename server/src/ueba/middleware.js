import UebaEvent from '../models/UebaEvent.js';
import { isAllowed } from './policies.js';

// naive baseline store for anomaly detection
const baseline = new Map(); // key: agent, value: { count, lastTs }

export async function uebaMiddleware(req, res, next) {
  // accept header or query param fallback (useful when testing via browser)
  let agent = req.headers['x-agent'] || req.query.agent || 'UserUI';
  const resource = req.path;
  const now = Date.now();

  // Soft fallback: allow GETs to /api/* for UserUI even if header missing
  const softAllow = req.method === 'GET' && resource.startsWith('/api/');

  // Policy check
  if (!isAllowed(agent, resource) && !softAllow) {
    await UebaEvent.create({
      agent,
      action: req.method,
      resource,
      outcome: 'blocked',
      severity: 'high',
      details: { reason: 'policy_violation' }
    });
    return res.status(403).json({ error: 'UEBA: policy violation' });
  }

  // Simple anomaly: unusually high request rate from an agent
  const b = baseline.get(agent) || { count: 0, lastTs: now };
  const delta = now - b.lastTs;
  const rate = delta > 0 ? b.count / delta : b.count;
  if (rate > 0.01) { // arbitrary threshold for demo
    await UebaEvent.create({
      agent,
      action: req.method,
      resource,
      outcome: 'alert',
      severity: 'medium',
      details: { reason: 'unusual_rate', rate }
    });
  }
  baseline.set(agent, { count: b.count + 1, lastTs: now });

  // Log allowed event (low severity)
  await UebaEvent.create({
    agent,
    action: req.method,
    resource,
    outcome: 'allowed',
    severity: 'low'
  });

  next();
}
