import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import createUserTable from "./data/createUseTable.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);

// Error handling middleware

// Create table before starting server
createUserTable();

// Testing POSTGRES
app.get("/", async (req, res, next) => {
    try {
        const result = await pool.query("SELECT current_database()");
        res.send(`The database name is : ${result.rows[0].current_database}`);
    } catch (err) {
        next(err);
    }
});
// Server running

app.listen(port, ()=> {
    console.log(`Server is running at port: ${port}`)
})