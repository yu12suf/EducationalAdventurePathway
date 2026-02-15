import { Router } from 'express';
import { checkDeadlinesAndNotify } from '../services/notification.service';

const router = Router();

// GET /api/test – health check
router.get('/', (_req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// POST /api/test/trigger-deadline-check – manually trigger deadline notifications
router.post('/trigger-deadline-check', async (_req, res) => {
  try {
    await checkDeadlinesAndNotify();
    res.json({ success: true, message: 'Deadline check triggered successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;