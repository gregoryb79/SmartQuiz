import express from "express";
import path from "path";
import { json } from "body-parser";
import { router as questionsRouter} from "./routers/questions.router";
import { router as leaderboardRouter} from "./routers/leaderboard.router";
import { router as usersRouter} from "./routers/users.router";
import cors from "cors";

export const app = express();

app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use((req, _, next) => {
    console.log(new Date().toLocaleString(), req.method, req.url);
    next();
});

app.use(json());

app.use("/questions", questionsRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/users", usersRouter);



