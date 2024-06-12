import { Schema, model, models } from 'mongoose';

// Define the schema for attendance
const majorsSchema = new Schema({
    venue: {
        type: String,
        required: true, // Mark as required
        trim: true // Trim whitespace
    },
    name: {
        type: String,
        required: true, // Mark as required
        trim: true // Trim whitespace
    },
    code: {
        type: String,
        required: true, // Mark as required
        trim: true, // Trim whitespace
        unique: true // Ensure uniqueness
    },
    schedule: {
        startTime: {
            type: Date,
            required: true // Mark as required
        },
        endTime: {
            type: Date,
            required: true // Mark as required
        }
    }
}, {
    timestamps: true // Enable timestamps to track creation and updates
});

// Ensure model is only created once
export const Major = models.Attends || model('Major', majorsSchema);
