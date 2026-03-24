import express from "express";


// import { protect, isAdmin } from "../middleware/authMiddleware.js";
 
import { registerUser,loginUser,getUserProfile,updateUser ,getAllUsers , deleteUser} from "../Controllers/UserController.js";
import { isAdmin ,requireSignin } from "../Middlewares/AuthMiddlewares.js";

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// USER
router.get("/profile", requireSignin, getUserProfile);
router.put("/update", requireSignin, updateUser);

// ADMIN
router.get("/", requireSignin, isAdmin, getAllUsers);
router.delete("/:id", requireSignin, isAdmin, deleteUser);

export default router;