const express = require("express");
const express = require("express");
const Course = require("./Course");

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

// Delete all courses
router.delete("/deleteall", async (req, res) => {
    try {
        await Course.deleteMany({});
        res.json({ message: "All courses deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get single course
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Add a course
router.post("/", async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.json(course);
    } catch (err) {
        res.status(500).json({