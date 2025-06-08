import express from 'express';
import { auth } from '../middleware/auth';
export const router = express.Router();

router.get("/",auth(), async (_, res) => {
    res.status(200).json({
        message: "Welcome to the SmartQuiz leaderboard API",});
});