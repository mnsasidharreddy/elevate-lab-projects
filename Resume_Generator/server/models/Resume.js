import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  payload: { type: Object, required: true },
  templateId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Resume", resumeSchema);
