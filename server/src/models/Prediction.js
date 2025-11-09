import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  component: String,
  probability: Number,
  severity: String,
  message: String
}, { timestamps: true });

export default mongoose.model('Prediction', PredictionSchema);
