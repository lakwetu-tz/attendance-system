import express, { Request, Response } from 'express';
import { Major } from '../models/majorModule'
import moment from 'moment'

// Controller function to handle attendance time check
export const getAttendanceTime = async (req: Request, res: Response) => {
    try {
        const { time } = req.query;

        if (!time) {
            return res.status(400).json({ error: 'Time parameter is required' });
        }

        const currentTime = moment(time as string, moment.ISO_8601, true);
        if (!currentTime.isValid()) {
            return res.status(400).json({ error: 'Invalid time format' });
        }

        console.log('Current Time:', currentTime.toISOString());

        const modules = await Major.find();
        console.log('Modules found:', modules.length);

        for (const module of modules) {
            const startTime = moment(module.schedule.startTime);
            const endTime = moment(module.schedule.endTime);

            console.log('Module:', module.name);
            console.log('Start Time:', startTime.toISOString());
            console.log('End Time:', endTime.toISOString());

            if (currentTime.isBetween(startTime, endTime, null, '[]')) {
                console.log('Match found for module:', module.name);
                return res.status(200).json({ status: "Ok", message: 'Current time is within module time range', module });
            }
        }

        console.log('No match found for the provided time');
        return res.status(400).json({ error: 'No module found for the provided time' });
    } catch (error) {
        console.error('Error fetching attendance time', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const handleAttendance = async (req: Request, res: Response) => {
    try {
        const { studentId, moduleId } = req.body;

        // Check if the student is enrolled in the module
        const major = await Major.findById(moduleId);
        if (!major || !major.students.includes(studentId)) {
            return res.status(400).json({ error: 'Student is not enrolled in the module' });
        }

        // Check if the student has already marked attendance for the module
        const attendanceRecord = major.attendance.find(
            (record: any) => record.studentId === studentId && record.date === new Date().toISOString().split('T')[0]
        );

        if (attendanceRecord) {
            return res.status(400).json({ error: 'Attendance already marked for the module' });
        }

        // Mark attendance for the student
        major.attendance.push({ studentId, date: new Date().toISOString().split('T')[0] });
        await major.save();

        return res.status(200).json({ message: 'Attendance marked successfully' });

    } catch (error) {
        console.error('Error marking attendance', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

export const getAttendanceReport = async (req: Request, res: Response) => {
    try {
        const { moduleId } = req.query;

        if (!moduleId) {
            return res.status(400).json({ error: 'Module ID parameter is required' });
        }

        const major = await Major.findById(moduleId);

        if (!major) {
            return res.status(404).json({ error: 'Module not found' });
        }

        return res.status(200).json({ attendance: major.attendance });

    } catch (error) {
        console.error('Error fetching attendance report', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

export const getStudentAttendance = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.query;
        if (!studentId) {
            return res.status(400).json({ error: 'Student ID parameter is required' });
        }

        const majors = await Major.find({ students: studentId });
        const attendanceRecords = [];


        for (const major of majors) {
            const attendance = major.attendance.filter(
                (record: any) => record.studentId === studentId
            );

            attendanceRecords.push({
                moduleId: major._id,
                moduleName: major.name,
                attendance,
            });
        }
        return res.status(200).json({ attendance: attendanceRecords });
    } catch (error) {
        console.error('Error fetching student attendance', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

export const getModuleAttendance = async (req: Request, res: Response) => {
    try {
        const { moduleId } = req.query;

        if (!moduleId) {
            return res.status(400).json({ error: 'Module ID parameter is required' });
        }

        const major = await Major.findById(moduleId);

        if (!major) {
            return res.status(404).json({ error: 'Module not found' });
        }

        return res.status(200).json({ attendance: major.attendance });

    } catch (error) {
        console.error('Error fetching module attendance', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};



