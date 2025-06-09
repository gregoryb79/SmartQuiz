import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,        
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    totalScore: {
        type: Number,
        default: 0,
    },
    topScore: {
        type: Number,
        default: 0,
    },
    totalGames: {
        type: Number,
        default: 0,
    },
    lastScore: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export const User = model("User",userSchema);