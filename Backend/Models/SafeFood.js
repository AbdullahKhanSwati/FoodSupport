import mongoose from "mongoose";

const safeFoodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ✅ improves query performance
    },

    name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
      maxlength: [100, "Food name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description too long"],
      default: "",
    },

    recipe: {
      type: String,
      trim: true,
      maxlength: [5000, "Recipe too long"],
      default: "",
    },

    type: {
      type: String,
      enum: {
        values: ["liquid", "solid", "unsure"],
        message: "Type must be liquid, solid, or unsure",
      },
      required: true,
    },

    temperature: {
      type: String,
      enum: {
        values: ["hot", "cold", "warm", "frozen"],
        message: "Invalid temperature value",
      },
      required: true,
    },

    image: {
      type: String,
      required: false // can store URL (Cloudinary etc.)
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Optional compound index (avoid duplicate food names per user)
safeFoodSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("SafeFood", safeFoodSchema);












