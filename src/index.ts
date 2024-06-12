import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';

import attendanceRoutes from './routes/attendanceRoutes'
import majorRoutes from './routes/majorRoutes'

dotenv.config();

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.json());
app.disable("x-powered-by")
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))

// routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/v1/attend', attendanceRoutes);
app.use('/api/v1/major', majorRoutes);

mongoose.connect(process.env.mongodb_uri || "", {
    family: 4,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
})
    .then(() => {
        app.listen(4000, "0.0.0.0", () => {

            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error: any) => {
        console.error('Error connecting to MongoDB:', error);
    });
