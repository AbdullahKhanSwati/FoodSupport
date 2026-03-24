// import mongoose from "mongoose";
// import dotenv from "dotenv";
// const PORT = process.env.PORT || 5000;
// import express from "express"
// import connectDb from "../Config/db.js";


// dotenv.config();
// const app = express();
// app.use(express.json());



// connectDb();

// app.get('/', (req, res) => {
//   res.json({
//     message: "welcome to Foog support app"
//   });
// });

//  app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });






import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "../Config/db.js";

// ROUTES
import UserRoutes from "../Routes/UserRoutes.js" 
import safeFoodRoutes from "../Routes/SafeFoodRoutes.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Food Support App API",
  });
});

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/safe-foods", safeFoodRoutes);

// ================= 404 HANDLER =================
app.use((req, res) => {
    console.log("inside home route")
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb(); // ✅ Proper DB connection

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Exit if DB fails
  }
};

startServer();


export const handler = serverless(app);
export default app;
