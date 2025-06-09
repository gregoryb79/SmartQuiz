import { apiClient, clearToken, setToken } from "./apiClient";

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

    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //     resolve(true);
    //     }, 1000);
    // });
}
    