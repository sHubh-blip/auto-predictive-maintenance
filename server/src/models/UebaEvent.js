import mongoose from 'mongoose';

const UebaEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  agent: String,
  action: String,
  resource: String,
  outcome: { type: String, enum: ['allowed', 'blocked', 'alert'] },
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  details: Object
}, { timestamps: true });

export default mongoose.model('UebaEvent', UebaEventSchema);
