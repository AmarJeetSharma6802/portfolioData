import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv";
import { portfolioData } from './model/model.js';

const app = express();

// Load environment variables from .env file
dotenv.config();

// CORS Configuration
app.use(cors({
    origin: 'https://portfolio-5y00jil8e-amarjeetsharma6802s-projects.vercel.app', // Adjust based on your frontend URL
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
        process.exit(1); // Exit process with failure
    }
};

connectDb();       

// Register endpoint
app.post("/portfolio/register", async (req, res) => {
    try {
        // Destructure form data from the request body
        const { name, email, phone, message } = req.body;

        // Log received data for debugging
        console.log("Received data: ", { name, email, phone, message });

        // Validation
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // Sanitize input by trimming any leading/trailing spaces
        const sanitizedEmail = email.trim();
        const sanitizedPhone = phone.trim();
        const sanitizedName = name.trim();

        // Check if the user already exists in the database
        const userExist = await portfolioData.findOne({
            $or: [{ email: sanitizedEmail }, { phone: sanitizedPhone }, { name: sanitizedName }]
        });

        // Log the result of the user existence check for debugging
        console.log("User existence check result: ", userExist);

        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user if no existing user found
        const user = await portfolioData.create({
            name: sanitizedName,
            email: sanitizedEmail,
            phone: sanitizedPhone,
            message
        });

        return res.status(201).json({
            message: "User submitted successfully",
            user
        });

    } catch (error) {
        // Catch any unexpected errors and send them as a response
        console.error("Error occurred: ", error.message);
        return res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(7000, () => {
    console.log(`Server is running on port 7000`);
});

export default app;
