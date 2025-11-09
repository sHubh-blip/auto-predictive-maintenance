import express from 'express';
import UebaEvent from '../models/UebaEvent.js';

const router = express.Router();

router.get('/events', async (req, res) => {
  const events = await UebaEvent.find().sort({ createdAt: -1 }).limit(200);
  res.json(events);
});

export default router;
