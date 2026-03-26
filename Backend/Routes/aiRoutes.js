import express from "express";
import { getFoodSuggestions } from "../Controllers/aiController.js";
import { requireSignin } from "../Middlewares/AuthMiddlewares.js";

const router = express.Router();

// Generate AI suggestions
router.post("/suggestions", requireSignin, getFoodSuggestions);

export default router;
