"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getCourse = exports.getCourses = exports.createCourse = void 0;
const database_1 = require("../config/database");
const Course_1 = require("../models/Course");
const User_1 = require("../models/User");
const courseRepository = database_1.AppDataSource.getRepository(Course_1.Course);
const createCourse = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== User_1.UserRole.TEACHER) {
            return res.status(403).json({
                success: false,
                error: '只有教師可以建立課程'
            });
        }
        const courseDto = req.body;
        const course = new Course_1.Course();
        Object.assign(course, courseDto);
        course.teacher_id = user.id;
        await courseRepository.save(course);
        res.status(201).json({
            success: true,
            data: {
                course: {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    capacity: course.capacity,
                    start_date: course.start_date,
                    end_date: course.end_date,
                    schedule: course.schedule,
                    location: course.location,
                    price: course.price,
                    teacher_id: course.teacher_id
                }
            }
        });
    }
    catch (error) {
        console.error('建立課程錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.createCourse = createCourse;
const getCourses = async (req, res) => {
    try {
        const courses = await courseRepository.find({
            relations: ['teacher']
        });
        res.json({
            success: true,
            data: {
                courses: courses.map(course => ({
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    capacity: course.capacity,
                    start_date: course.start_date,
                    end_date: course.end_date,
                    schedule: course.schedule,
                    location: course.location,
                    price: course.price,
                    teacher: {
                        id: course.teacher.id,
                        name: course.teacher.name
                    }
                }))
            }
        });
    }
    catch (error) {
        console.error('查詢課程錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.getCourses = getCourses;
const getCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['teacher']
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                error: '找不到課程'
            });
        }
        res.json({
            success: true,
            data: {
                course: {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    capacity: course.capacity,
                    start_date: course.start_date,
                    end_date: course.end_date,
                    schedule: course.schedule,
                    location: course.location,
                    price: course.price,
                    teacher: {
                        id: course.teacher.id,
                        name: course.teacher.name
                    }
                }
            }
        });
    }
    catch (error) {
        console.error('查詢課程錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.getCourse = getCourse;
const updateCourse = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const courseDto = req.body;
        const course = await courseRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['teacher']
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                error: '找不到課程'
            });
        }
        if (user.role !== User_1.UserRole.TEACHER) {
            return res.status(403).json({
                success: false,
                error: '只有教師可以更新課程'
            });
        }
        if (course.teacher_id !== user.id) {
            return res.status(403).json({
                success: false,
                error: '只能更新自己的課程'
            });
        }
        Object.assign(course, courseDto);
        await courseRepository.save(course);
        res.json({
            success: true,
            data: {
                course: {
                    id: course.id,
                    name: course.name,
                    description: course.description,
                    capacity: course.capacity,
                    start_date: course.start_date,
                    end_date: course.end_date,
                    schedule: course.schedule,
                    location: course.location,
                    price: course.price,
                    teacher_id: course.teacher_id
                }
            }
        });
    }
    catch (error) {
        console.error('更新課程錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.updateCourse = updateCourse;
const deleteCourse = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const course = await courseRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['teacher']
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                error: '找不到課程'
            });
        }
        if (user.role !== User_1.UserRole.TEACHER) {
            return res.status(403).json({
                success: false,
                error: '只有教師可以刪除課程'
            });
        }
        if (course.teacher_id !== user.id) {
            return res.status(403).json({
                success: false,
                error: '只能刪除自己的課程'
            });
        }
        await courseRepository.remove(course);
        res.json({
            success: true,
            message: '課程已成功刪除'
        });
    }
    catch (error) {
        console.error('刪除課程錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.deleteCourse = deleteCourse;
