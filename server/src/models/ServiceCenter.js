import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  isBooked: { type: Boolean, default: false }
}, { _id: true });

const ServiceCenterSchema = new mongoose.Schema({
  name: String,
  city: String,
  capacityPerHour: Number,
  slots: [SlotSchema]
}, { timestamps: true });

export default mongoose.model('ServiceCenter', ServiceCenterSchema);
