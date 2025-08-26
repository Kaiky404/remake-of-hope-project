import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  age: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

petSchema.index({ name: 1, owner: 1}, { unique: true})

export default mongoose.model('Pet', petSchema)
