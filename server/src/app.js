import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import { uebaMiddleware } from './ueba/middleware.js';
import vehiclesRouter from './routes/vehicles.js';
import orchestratorRouter from './routes/orchestrator.js';
import schedulingRouter from './routes/scheduling.js';
import uebaRouter from './routes/ueba.js';
import Vehicle from './models/Vehicle.js';
import ServiceCenter from './models/ServiceCenter.js';
import insightsRouter from './routes/insights.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Public welcome page (before UEBA)
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'Auto Maintenance API',
    try: ['/health', '/api/vehicles?agent=UserUI', '/api/ueba/events?agent=UserUI']
  });
});

app.use(uebaMiddleware);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/orchestrator', orchestratorRouter);
app.use('/api/scheduling', schedulingRouter);
app.use('/api/ueba', uebaRouter);
app.use('/api/insights', insightsRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auto_maintenance';

function genSlots(days = 5) {
  const slots = [];
  const now = new Date();
  for (let d = 0; d < days; d++) {
    for (let h = 9; h <= 17; h += 2) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, h, 0, 0);
      const end = new Date(start.getTime() + 90 * 60000);
      slots.push({ start, end, isBooked: false });
    }
  }
  return slots;
}

async function autoSeed() {
  const vCount = await Vehicle.countDocuments();
  const cCount = await ServiceCenter.countDocuments();
  if (vCount === 0 || cCount === 0) {
    console.log('Auto-seeding demo data...');
    if (cCount === 0) {
      await ServiceCenter.insertMany([
        { name: 'Metro Service Center A', city: 'Mumbai', capacityPerHour: 10, slots: genSlots() },
        { name: 'City Service Center B', city: 'Pune', capacityPerHour: 8, slots: genSlots() },
        { name: 'Tier-2 Service Center C', city: 'Nagpur', capacityPerHour: 6, slots: genSlots() }
      ]);
    }
    if (vCount === 0) {
      const vehicles = [];
      for (let i = 0; i < 10; i++) {
        vehicles.push({
          vin: `VIN000${i}`,
          ownerName: `Owner ${i}`,
          contact: { phone: `90000${1000 + i}`, email: `owner${i}@example.com` },
          usagePattern: { dailyKm: 30 + i * 3, cityVsHighway: 0.6 },
          mileageKm: 10000 + i * 2300,
          lastServiceDate: new Date(Date.now() - (30 + i) * 86400000),
          dtcCodes: i % 3 === 0 ? ['P0420'] : i % 3 === 1 ? ['P0300'] : ['C1234'],
          sensorSnapshot: {
            engine_temp: 90 + i * 2,
            oil_pressure: 30 - i,
            battery_voltage: 12.2 - i * 0.1,
            tire_pressure_fl: 32 - (i % 4),
            tire_pressure_fr: 32 - (i % 3),
            tire_pressure_rl: 32 - (i % 5),
            tire_pressure_rr: 32 - (i % 2),
            brake_pad_thickness: 8 - (i * 0.3)
          }
        });
      }
      await Vehicle.insertMany(vehicles);
    }
    console.log('Auto-seed complete.');
  }
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Mongo connected');
    await autoSeed();
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
