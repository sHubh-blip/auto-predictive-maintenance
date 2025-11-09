import express from 'express';
import axios from 'axios';
import Vehicle from '../models/Vehicle.js';
import Prediction from '../models/Prediction.js';
import Conversation from '../models/Conversation.js';
import ServiceCenter from '../models/ServiceCenter.js';
import { config } from '../config.js';

const router = express.Router();

// Orchestrator: Predict issue -> craft persuasive script -> suggest schedule
router.post('/predict-and-engage/:vehicleId', async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.vehicleId);
  if (!vehicle) return res.status(404).json({ error: 'vehicle not found' });

  const payload = {
    vin: vehicle.vin,
    sensors: vehicle.sensorSnapshot || {},
    dtc: vehicle.dtcCodes || [],
    usage: vehicle.usagePattern || {},
    mileageKm: vehicle.mileageKm || 0
  };

  const { data: pred } = await axios.post(`${config.pyServiceUrl}/predict`, payload, {
    headers: { 'x-agent': 'DiagnosisAgent' }
  });

  const prediction = await Prediction.create({
    vehicle: vehicle._id,
    component: pred.component,
    probability: pred.probability,
    severity: pred.severity,
    message: pred.message
  });

  // Find nearest available slot (naive: first center with a free slot)
  const center = await ServiceCenter.findOne({ 'slots.isBooked': false });
  let proposedSlot = null;
  if (center) {
    const slot = center.slots.find(s => !s.isBooked);
    proposedSlot = { centerId: center._id, centerName: center.name, start: slot.start, end: slot.end };
  }

  const persuasive = `Hi ${vehicle.ownerName}, our proactive diagnostics indicate a ${pred.severity} risk with your ${pred.component}. ` +
    `Addressing this now can prevent breakdowns and save costs. We can book you at ${proposedSlot ? center.name : 'your preferred center'} ` +
    `${proposedSlot ? 'on ' + new Date(proposedSlot.start).toLocaleString() : 'at your convenience'}. Shall we proceed?`;

  const convo = await Conversation.create({ vehicle: vehicle._id, transcript: persuasive, status: 'proposed' });

  res.json({ vehicle, prediction, conversation: convo, proposedSlot });
});

export default router;
