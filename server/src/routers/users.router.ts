import express from 'express';
export const router = express.Router();
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { User } from '../models/user';
import { createHash } from "crypto";
import { auth } from '../middleware/auth';

function createToken(userId: string, email: string ) {
    return jwt.sign({ sub: userId, email }, process.env.SESSION_SECRET!, { expiresIn: "24h" });    
}

function hashPasswordWithSalt(password: string, salt: string) {
    const hash = createHash("sha512");

    hash.update(password);
    hash.update(salt);

    return hash.digest("base64");
}

router.get("/scores/:userId", async (req, res) => {
    console.log("Getting users and their scores");
    const { userId } = req.params;

    try {
        const users = await User.find({}, { username: 1, totalScore: 1})
                            .sort({ totalScore: -1 }).limit(10);
        console.log(`Found top ${users.length} users for the leaderboard`);
        users.forEach((user, index) => {user.rank = index + 1});
        if (!users || users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        if (!userId || users.some(user => user._id.toString() === userId)) {
            res.status(200).json(users);
        } else {
            const allUsers = await User.find({}, { username: 1, totalScore: 1 }).sort({ totalScore: -1 });
            const index = allUsers.findIndex(user => user._id.toString() === userId);
            if (index === -1) {
                res.status(404).json({ message: "User not found in leaderboard" });
                return;
            }else {console.log(`User found in leaderboard at index: ${index} out of ${allUsers.length}`)}

            const start = Math.max(0, index - 2);
            const end = Math.min(allUsers.length, index + 3);
            console.log(`Fetching peer users from index ${start} to ${end} (total users: ${allUsers.length})`);
            const peerUsers = allUsers.slice(start, end);
            console.log("Peer users found:", peerUsers);

            peerUsers.forEach((user, index) => {user.rank = start + index + 1});
            users.forEach((user, index) => {user.rank = index + 1});

            const result = [
                    ...users.slice(0, Math.max(0, users.length - peerUsers.length)),
                    ...peerUsers
            ];      
            
            result[users.length - peerUsers.length -1].rank = -1;
            console.log("Resulting users:", result);
            
            res.status(200).json(result);
        }       
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }    
});

router.get("/:userId",auth(), async (req, res) => {
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

    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
            console.log("Password doesn't fit the rules");
            res.status(400).json({ message: "Password doesn't fit the rules" });
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

router.put("/score",auth(), async (req, res) => {
    const { userId, score } = req.body;
    console.log("Updating score for userId:", userId, "with score:", score);

    if (!userId || score === undefined) {
        res.status(400).json({ message: "User ID and score are required" });
        return;
    }

    try {
        const user = await User.findById(userId);
        console.log("Found user:", user);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.totalScore += score;
        user.lastScore = score;
        user.totalGames += 1;
        if (score > user.topScore) {
            user.topScore = score;
        }
        await user.save();
        console.log("User score updated:");
        res.status(200).json({ message: "Score updated successfully" });
    } catch (error) {
        console.error("Error updating user score:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});