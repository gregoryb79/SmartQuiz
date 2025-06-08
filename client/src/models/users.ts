export function getUserName(): string | null {
    const user = localStorage.getItem("user");
    if (user) {
        return JSON.parse(user).username;
    }
    return null;
}