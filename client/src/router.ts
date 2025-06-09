import { createBrowserRouter, redirect } from "react-router";
// import { OrdersHistory } from "./pages/OrdersHistory";
// import { NewOrder } from "./pages/NewOrder";
// import { TrackOrder } from "./pages/TrackOrder";
import { App } from "./App";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Quiz } from "./pages/Quiz";
import { Leaderboard } from "./pages/Leaderboard";
import { getScores } from "./models/scores";
// import { getQuizCategories } from "./models/questions";
import { getUserName } from "./models/users";
// import { HandleOrder } from "./pages/HandleOrder";
import { LogIn } from "./pages/LogIn";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";



export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        loader: () => {
            return getUserName();
        },
        children: [
            // { index: true, loader: () => redirect("/orders-history") },
            { path: "*", Component: NotFound },   
            { 
                path: "/", 
                Component: Home,
                loader: () => {
                    return getUserName();
                }
            },         
            { path: "/new-quiz", Component: Quiz },
            { 
                path: "/leaderboard", 
                Component: Leaderboard, 
                loader: () => {
                    return getScores();
                }
            },
            {
                path: "/login",
                Component: LogIn,
                loader: () => {
                    return getUserName();
                },
            },
            {
                path: "/register",
                Component: Register,
                loader: () => {
                    return getUserName();
                },
            },
            {
                path: "/profile",
                Component: Profile,
                loader: () => {
                    return getUserName();
                },
            },
        ],
    },
]);
