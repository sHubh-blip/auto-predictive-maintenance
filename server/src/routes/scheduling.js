import express from 'express';
import ServiceCenter from '../models/ServiceCenter.js';
import Appointment from '../models/Appointment.js';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

router.get('/centers', async (req, res) => {
  const centers = await ServiceCenter.find();
  res.json(centers.map(c => ({ _id: c._id, name: c.name, city: c.city })));
});

router.get('/slots', async (req, res) => {
  const { centerId } = req.query;
  const center = await ServiceCenter.findById(centerId);
  if (!center) return res.status(404).json({ error: 'center not found' });
  const slots = center.slots.filter(s => !s.isBooked).slice(0, 10);
  res.json(slots);
});

router.post('/book', async (req, res) => {
  const { vehicleId, centerId, start } = req.body;
  const center = await ServiceCenter.findById(centerId);
  const vehicle = await Vehicle.findById(vehicleId);
  if (!center || !vehicle) return res.status(404).json({ error: 'not found' });
  const slot = center.slots.find(s => !s.isBooked && new Date(s.start).toISOString() === new Date(start).toISOString());
  if (!slot) return res.status(400).json({ error: 'slot unavailable' });
  slot.isBooked = true;
  await center.save();

  const appt = await Appointment.create({
    vehicle: vehicle._id,
    serviceCenter: center._id,
    slotStart: slot.start,
    slotEnd: slot.end,
    status: 'booked'
  });
  res.json(appt);
});

export default router;
