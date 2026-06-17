import express from 'express';
import { listCourses, getCourse, createCourse } from '../controllers/courseController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorizeRoles('instructor', 'admin'), createCourse);

export default router;