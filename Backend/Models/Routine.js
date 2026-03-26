import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  stepText: { type: String, required: true },
  timer: { type: Number, default: 30 },
  order: { type: Number },
});

const routineSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    steps: [stepSchema],
  },
  { timestamps: true }
);

const Routine = mongoose.model("Routine", routineSchema);
export default Routine;
