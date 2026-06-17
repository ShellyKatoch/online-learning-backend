import asyncHandler from 'express-async-handler';
import Course from '../models/courseModel.js';

export const listCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
});

export const getCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    res.json(course);
});

export const createCourse = asyncHandler(async (req, res) => {
    const { title, description, price, category } = req.body;
    const course = await Course.create({
        title,
        description,
        price,
        category,
        instructor: req.user.id,
        published: false,
    });
    res.status(201).json(course);
});