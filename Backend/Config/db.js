import mongoose from "mongoose";


const connectDb = async()=>{
try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected to database successfull`);

} catch (error) {
    console.log(error);
}

}
export default connectDb;





// import mongoose from "mongoose";

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connectDb = async () => {
//   // Return cached connection if available
//   if (cached.conn) {
//     console.log("✅ Using cached MongoDB connection");
//     return cached.conn;
//   }

//   // If no connection promise exists, create one
//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       maxPoolSize: 10, // Maintain up to 10 socket connections
//       serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
//       socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
//     };

//     cached.promise = mongoose.connect(process.env.MONGO_URL, opts).then((mongoose) => {
//       console.log("✅ MongoDB connected successfully");
//       return mongoose;
//     }).catch((error) => {
//       console.error("❌ MongoDB connection error:", error);
//       cached.promise = null; // Reset promise on error so we can retry
//       throw error;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// };

// export default connectDb;
