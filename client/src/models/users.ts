import { apiClient, clearToken, getToken, setToken } from "./apiClient";

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
    rank?:number;  
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

export function getUserId(): string | null {
    const token = getToken();
    if (!token) {
        return null;
    }
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub;
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
    console.log("Fetching user profile...");   
    
    const userId =  getUserId();
    if (!userId) {
        throw new Error("User ID not found. Please log in again.");
    }

    try {
        const res = await apiClient.get(`/users/${userId}`);
        return res.data as User;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Failed to fetch user profile. Please try again later.");
    }
}

export type UserScore = Omit<User,"email" | "createdAt" | "updatedAt" | "lastScore" | "totalGames" | "topScore">;
export async function getUsersScores(): Promise<UserScore[]> {
    const userId = getUserId();
    try {
        const res = await apiClient.get(`/users/scores/${userId}`);
        const scores = res.data as UserScore[];
        if (!scores || scores.length === 0) {
            console.warn("No users found for the leaderboard.");
            return [];
        }
        console.log("Leaderboard results: ",scores);
        return scores;        
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users. Please try again later.");
    }
}

export async function updateUserScore(score:number): Promise<void> {
    
    const userId = getUserId();
    if (!userId) {
        throw new Error("User ID not found. Please log in again.");
    }

    try {
        await apiClient.put(`/users/score`,{userId, score});
    } catch (error) {
        console.error("Error updating user score:", error);
        throw new Error("Failed to update user score. Please try again later.");
    }
}
