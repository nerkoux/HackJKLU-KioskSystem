import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  mbtiResult: String,
  mbtiResponses: Object,
  skillRatings: Object,
  completedAt: Date,
  assessmentCompleted: {
    type: Boolean,
    default: false
  },
  careerGuidance: String,
  learningResources: Array,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);