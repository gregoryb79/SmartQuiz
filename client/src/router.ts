import { createBrowserRouter, redirect } from "react-router";
// import { OrdersHistory } from "./pages/OrdersHistory";
// import { NewOrder } from "./pages/NewOrder";
// import { TrackOrder } from "./pages/TrackOrder";
import { App } from "./App";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Quiz } from "./pages/Quiz";
import { History } from "./pages/History";
import { getHistory } from "./models/history";
// import { HandleOrder } from "./pages/HandleOrder";
// import { LogIn } from "./pages/LogIn";
// import { Register } from "./pages/Register";



export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            // { index: true, loader: () => redirect("/orders-history") },
            { path: "*", Component: NotFound },   
            { path: "/", Component: Home },         
            { path: "/new-quiz", Component: Quiz },
            { 
                path: "/history", 
                Component: History, 
                loader: () => {
                    return getHistory();
                }
            },
            // {
            //     path: "/login",
            //     Component: LogIn,
            // },
            // {
            //     path: "/register",
            //     Component: Register,
            // },
        ],
    },
]);
