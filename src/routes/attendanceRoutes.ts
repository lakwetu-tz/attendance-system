import { Router } from 'express';
import { getAttendanceTime } from '../controllers/attendanceController';

const router = Router();

router.post('/', getAttendanceTime);

export default router;