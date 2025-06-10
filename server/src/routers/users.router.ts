import express from 'express';
export const router = express.Router();
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { User } from '../models/user';
import { createHash } from "crypto";

function createToken(userId: string, email: string ) {
    return jwt.sign({ sub: userId, email }, process.env.SESSION_SECRET!, { expiresIn: "24h" });    
}

function hashPasswordWithSalt(password: string, salt: string) {
    const hash = createHash("sha512");

    hash.update(password);
    hash.update(salt);

    return hash.digest("base64");
}

router.get("/", async (_, res) => {
    console.log("Getting users and their scores");

    try {
        const users = await User.find({}, { username: 1, totalScore: 1}).sort({ totalScore: -1 });
        console.log("Users found:", users);

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({
        message: "Welcome to the SmartQuiz users API",});
});

router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log("Getting user profile for userId:", userId);

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;
    console.log("Registering user:", { email, username, password });

    if (!email || !username || !password) {
        res.status(400).json({ message: "Email, username, and password are required" });
        return;
    }

    try{
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409);
            res.send(`User with email ${email} already exists`);
            return;
        }

        const passwordHash = hashPasswordWithSalt(password, email);;

        const newUser = await User.create({ email, username, passwordHash });
        console.log("New user created:", newUser);
        const token = createToken(newUser._id.toString(), email);

        await newUser.save();
    
        res.status(201).json({token});
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Logging in user:", { email, password });

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const passwordHash = hashPasswordWithSalt(password, email);

        if (user.passwordHash !== passwordHash) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const token = createToken(user._id.toString(), email);
        res.status(200).json({ token, username: user.username });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});