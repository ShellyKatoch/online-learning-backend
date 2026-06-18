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
    const { title, description, price, category, level, duration, image, published } = req.body;
    const course = await Course.create({
        title,
        description,
        price,
        category,
        level,
        duration,
        image,
        instructor: req.user.id,
        published: Boolean(published),
    });
    res.status(201).json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const isOwner = course.instructor.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Forbidden: insufficient permissions');
    }

    const { title, description, price, category, level, duration, image, published } = req.body;

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.price = price ?? course.price;
    course.category = category ?? course.category;
    course.level = level ?? course.level;
    course.duration = duration ?? course.duration;
    course.image = image ?? course.image;
    if (typeof published === 'boolean') {
        course.published = published;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
});
