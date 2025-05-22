import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
// import { router as itemsRouter} from "./routers/items.router";
// import { router as ordersRouter} from "./routers/orders.router";
// import { router as usersRouter} from "./routers/users.router";
import cors from "cors";

export const app = express();

app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use((req, _, next) => {
    console.log(new Date().toLocaleString(), req.method, req.url);
    next();
});

app.use(json());
app.use(cookieParser(process.env.SESSION_SECRET));


// app.use((req, res, next) => {
//     if (req.path === "/login/check" || req.path === "/login/login" || req.path === "/login/register") {
//         console.log("Skipping authentication for login routes");
//         return next();
//     }
//     const userId = req.signedCookies.userId;
//     if (userId) {
//         console.log(`User ${userId} already logged in`);                
//     }else{
//         console.log("User not logged in");
//         res.status(401).json({ error: "Not authenticated" });
//         return;
//     }
//     next();
// });

app.use(json());


