import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import TestRoutes from "./routes/test.js";
import {connectDB} from "./config/db.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

// Test route
app.get("/", (req, res) => {
   res.send("Backend is running!");
 });

// Routes
app.use("/test", TestRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});