import express from 'express';
export const router = express.Router();
import { Question } from '../models/question';

router.get("/", async (req, res) => {
    console.log("Received GET request for categories");
    try {
        const categories = await Question.distinct("category");
        if (!categories || categories.length === 0) {
            console.log("No categories found");
            res.status(404).json({ message: "No categories found" });
            return;
        }
        console.log("Categories found:", categories);
        res.status(200).json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const { category, difficulty, streak, usedQuestions } = req.body;    
    console.log("Query params:", { category, difficulty, streak, usedQuestions });
    const filter = {
        category: category,
        difficulty: difficulty,        
        _id: { $nin: usedQuestions ? usedQuestions : [] }
    };
    if (category === "General") {        
        delete filter.category; 
    }
    if (streak > 2) {
        filter.difficulty = Math.min(difficulty + streak - 2,4);        
    }
    console.log(`Filter for question: difficulty=${filter.difficulty}, category=${filter.category ? filter.category : "General"}, streak=${streak}, usedQuestions=${usedQuestions ? usedQuestions.length : 0}`);
    
    try {
        // console.log("looking for question with filter:", filter);
        const [question] = await Question.aggregate([
            { $match: filter },
            { $sample: { size: 1 } }
        ]);
        if (!question) {
            console.log("No question found for the given criteria");
            res.status(404).json({ message: "No question found" });
            return;
        }
        res.status(200).json(question);
    } catch (error) {
        console.error("Error fetching question:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
});