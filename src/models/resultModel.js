import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: false }, 
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);

export default Result;
