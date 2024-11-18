import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv"
import { portfolioData } from './model/model.js';

const app = express();

dotenv.config()
// CORS Configuration
app.use(cors({
    origin: 'http://127.0.0.1:3000', 
    credentials: true
}));

app.use(express.json());

// MongoDB connection function
const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.ATLAS_DB, {
            useNewUrlParser: true,  
            useUnifiedTopology: true 
        });
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); 
    }
};

connectDb();       

// Register endpoint
app.post("/portfolio/register", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validation
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Check if the user already exists
        const userExist = await portfolioData.findOne({
            $or: [{ email }, { phone }, { name }]
          });
          console.log("userExist",userExist)
          

        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user if not already exists
        const user = await portfolioData.create({
            name,
            email,
            phone,
            message
        });

        return res.status(201).json({
            message: "User submitted successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(7000, () => {
    console.log(`Server is running on port 7000`);
});

export default app      