import express from "express";
import {
  createSafeFood,
  getSafeFoods,
  getSafeFoodById,
  updateSafeFood,
  deleteSafeFood,
  toggleFavorite,
} from "../Controllers/SafeFoodController.js";


import { requireSignin } from "../Middlewares/AuthMiddlewares.js";

const router = express.Router();

// CREATE
router.post("/", requireSignin, createSafeFood);

// GET ALL + FILTER
router.get("/", requireSignin, getSafeFoods);

// GET SINGLE
router.get("/:id", requireSignin, getSafeFoodById);

// UPDATE
router.put("/:id", requireSignin, updateSafeFood);

// DELETE
router.delete("/:id", requireSignin, deleteSafeFood);

// FAVORITE TOGGLE
router.patch("/:id/favorite", requireSignin, toggleFavorite);

export default router;