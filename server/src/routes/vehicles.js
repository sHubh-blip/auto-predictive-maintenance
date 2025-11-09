import express from 'express';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  res.json(vehicles);
});

router.get('/:id', async (req, res) => {
  const v = await Vehicle.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'not found' });
  res.json(v);
});

router.post('/:id/telemetry', async (req, res) => {
  const v = await Vehicle.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'not found' });
  v.sensorSnapshot = { ...v.sensorSnapshot, ...req.body };
  await v.save();
  res.json({ ok: true, vehicle: v });
});

export default router;
