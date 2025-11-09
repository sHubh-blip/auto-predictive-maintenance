import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  vin: { type: String, unique: true },
  ownerName: String,
  contact: {
    phone: String,
    email: String
  },
  usagePattern: {
    dailyKm: Number,
    cityVsHighway: Number
  },
  mileageKm: Number,
  lastServiceDate: Date,
  dtcCodes: [String],
  sensorSnapshot: {
    engine_temp: Number,
    oil_pressure: Number,
    battery_voltage: Number,
    tire_pressure_fl: Number,
    tire_pressure_fr: Number,
    tire_pressure_rl: Number,
    tire_pressure_rr: Number,
    brake_pad_thickness: Number
  }
}, { timestamps: true });

export default mongoose.model('Vehicle', VehicleSchema);
