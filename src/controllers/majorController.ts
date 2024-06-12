
import { Request, Response } from 'express';
import { Major } from '../models/majorModule';

// "venue": "Lecture Hall A",
//     "name": "Mathematics 101",
//         "code": "MATH101",
//             "schedule": {
//     "startTime": "2024-06-12T08:00:00.000Z",
//         "endTime": "2024-06-12T10:00:00.000Z"
// },

export const handleCreateMajor = async (req: Request, res: Response) => {
    try {
        const { name, code, venue, schedule } = req.body;

        // Validate input data
        if (!name || !code || !venue || !schedule || !schedule.startTime || !schedule.endTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if the major code already exists
        const existingMajor = await Major.findOne({ code });
        if (existingMajor) {
            return res.status(400).json({ error: 'Major code already exists' });
        }

        // Create a new major
        const newMajor = new Major({
            name,
            code,
            venue,
            schedule,
        });

        // Save the new major to the database
        await newMajor.save();

        // Respond with the created major
        res.status(201).json(newMajor);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const handleGetAllMajors = async (req: Request, res: Response) => {
    try {
        const majors = await Major.find();
        res.status(200).json(majors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const handleGetMajorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const major = await Major.findById(id);
        if (!major) {
            return res.status(404).json({ error: 'Major not found' });
        }
        res.status(200).json(major);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const handleUpdateMajor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, code, venue, schedule } = req.body;

        // Validate input data
        if (!name || !code || !venue || !schedule || !schedule.startTime || !schedule.endTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if the major exists
        const existingMajor = await Major.findById(id);
        if (!existingMajor) {
            return res.status(404).json({ error: 'Major not found' });
        }

        // Check if the updated major code already exists for another major
        const codeExistsForAnotherMajor = await Major.findOne({ code, _id: { $ne: id } });
        if (codeExistsForAnotherMajor) {
            return res.status(400).json({ error: 'Major code already exists for another major' });
        }

        // Update the major
        existingMajor.name = name;
        existingMajor.code = code;
        existingMajor.venue = venue;
        existingMajor.schedule = schedule;

        // Save the updated major to the database
        await existingMajor.save();

        // Respond with the updated major
        res.status(200).json(existingMajor);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

export const handleDeleteMajor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if the major exists
        const existingMajor = await Major.findById(id);
        if (!existingMajor) {
            return res.status(404).json({ error: 'Major not found' });
        }

        // Delete the major
        await Major.findByIdAndDelete(id);

        // Respond with a success message
        res.status(200).json({ message: 'Major deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

// Add more major-related functions as needed

