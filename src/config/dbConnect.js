import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
}

export const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });
        
        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error.message);
        });
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

