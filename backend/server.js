import dotenv from 'dotenv';
dotenv.config({path:'../.env'});
import cors from 'cors';
import express from 'express';

import mongoose from 'mongoose';

import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

app.use(postRoutes);
app.use(userRoutes);

const start = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}`);
        console.log("Connected to MongoDB");

        app.listen(9080, () => {
            console.log("Server is running on port 9080");
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

start();
