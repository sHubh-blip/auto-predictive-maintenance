import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Vehicle from '../src/models/Vehicle.js';
import ServiceCenter from '../src/models/ServiceCenter.js';

dotenv.config();

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

async function run() {
  await mongoose.connect(MONGO_URI);
  await Vehicle.deleteMany({});
  await ServiceCenter.deleteMany({});

  const centers = await ServiceCenter.insertMany([
    { name: 'Metro Service Center A', city: 'Mumbai', capacityPerHour: 10, slots: genSlots() },
    { name: 'City Service Center B', city: 'Pune', capacityPerHour: 8, slots: genSlots() },
    { name: 'Tier-2 Service Center C', city: 'Nagpur', capacityPerHour: 6, slots: genSlots() }
  ]);

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

  console.log(`Seeded ${vehicles.length} vehicles and ${centers.length} centers.`);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
