import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCenter' },
  slotStart: Date,
  slotEnd: Date,
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' }
}, { timestamps: true });

export default mongoose.model('Appointment', AppointmentSchema);
