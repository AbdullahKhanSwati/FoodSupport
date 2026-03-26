import express from "express";

import { createRoutine,getRoutines,getRoutineById,updateRoutine,deleteRoutine,addStep,updateStep,deleteStep } from "../Controllers/routineController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ROUTINE
router.post("/", protect, createRoutine);
router.get("/", protect, getRoutines);
router.get("/:id", protect, getRoutineById);
router.put("/:id", protect, updateRoutine);
router.delete("/:id", protect, deleteRoutine);

// STEPS
router.post("/:id/steps", protect, addStep);
router.put("/:id/steps/:stepIndex", protect, updateStep);
router.delete("/:id/steps/:stepIndex", protect, deleteStep);

export default router;