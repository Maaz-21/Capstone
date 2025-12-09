import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import TestRoutes from "./routes/test.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import {connectDB} from "./config/db.js";
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// API Routes (versioned under /api)
app.use("/api/test", TestRoutes);
app.use("/api/users", userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/model', modelRoutes);

// Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to DB', err);
});