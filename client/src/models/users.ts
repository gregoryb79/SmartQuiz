import { apiClient, clearToken, setToken } from "./apiClient";

export type User = {
    _id: string;
    email: string;
    username: string;
    totalScore: number;
    topScore: number;
    totalGames: number;
    lastScore: number;
    createdAt: string;
    updatedAt: string;
};

export function getUserName(): string | null {
    const user = localStorage.getItem("user");
    if (user) {
        return JSON.parse(user).username;
    }
    return null;
}

export function doLogOut() {
    localStorage.removeItem("user"); 
    clearToken();   
}

export async function putLogIn(email: string, password: string): Promise<boolean> {

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    try {
        const res = await apiClient.post("/users/login", { email, password });
        const { token, username } = res.data;
        setToken(token);
        localStorage.setItem("user", JSON.stringify({ username }));
        return true;
    } catch (error) {
        console.error("Error logging in user:", error); 
        throw new Error("Failed to log in user. Please check your credentials and try again.");
    }   
}

export async function postRegister(email: string, username: string, password: string): Promise<boolean> {

     if (!email || !username || !password) {
            throw new Error("Email, username, and password are required");
        }

    try {
        const res = await apiClient.post("/users/register", { email, username, password });
        const { token } = res.data;
        setToken(token);
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user. Please try again later.");
    }

    localStorage.setItem("user", JSON.stringify({ username }));

    return true;    
}

export async function getUserProfile(): Promise<User> {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("User is not logged in. Please log in to access your profile.");
    }

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    const userId =  decoded.sub;

    try {
        const res = await apiClient.get(`/users/${userId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Failed to fetch user profile. Please try again later.");
    }
}

export type UserScore = Omit<User,"email" | "createdAt" | "updatedAt" | "lastScore" | "totalGames" | "topScore">;
export async function getUsersScores(): Promise<UserScore[]> {
    try {
        const res = await apiClient.get("/users");
        return res.data as UserScore[];        
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users. Please try again later.");
    }
}
