import express from 'express';
export const router = express.Router();
import { Question } from '../models/question';

router.get("/", async (_, res) => {
    res.status(200).json({
        message: "Welcome to the SmartQuiz questions API",});
});

router.post("/", async (req, res) => {
    const { category, difficulty, streak } = req.body;
    console.log("Received PUT request with body:", req.body);
    try {
        await Question.create(req.body);
    } catch (error) {
        console.error("Error creating question:", error);
        res.status(500);
        res.end();
    }
    res.status(200).json({
        message: "Question updated successfully",
        category,
        difficulty,
        streak,
    });
});