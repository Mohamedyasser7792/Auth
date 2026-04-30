// Authentication => email , password    // Authorization => roles
import express from 'express';
import donenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route';
import connectDB from './config/db';


donenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
connectDB();
//Middleware

app.use(express.json());
app.use("/api/auth", authRoutes)
app.listen(PORT , ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})





