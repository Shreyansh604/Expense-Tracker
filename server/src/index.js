import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api", transactionRoutes);
// Server running

app.listen(port, ()=> {
    console.log(`Server is running at port: ${port}`)
})