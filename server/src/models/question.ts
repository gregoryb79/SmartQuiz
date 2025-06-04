import { Schema, model } from "mongoose";

const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answers: {
        type: [String],
        required: true,
        validate: (arr: string[]) => arr.length > 0,
    },
    correctAnswer: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    difficulty: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Question = model("Question", questionSchema);