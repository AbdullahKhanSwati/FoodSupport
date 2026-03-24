import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String, // ✅ FIXED
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String, // ✅ FIXED
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);