import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  transcript: String,
  status: { type: String, enum: ['proposed', 'accepted', 'declined'], default: 'proposed' }
}, { timestamps: true });

export default mongoose.model('Conversation', ConversationSchema);
