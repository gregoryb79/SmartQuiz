export function getUserName(): string | null {
    const user = localStorage.getItem("user");
    if (user) {
        return JSON.parse(user).username;
    }
    return null;
}

export function doLogOut() {
    localStorage.removeItem("user");    
}

export function putLogIn(email: string, password: string): Promise<boolean> {

    localStorage.setItem("user", JSON.stringify({ username: "testUser" }));

    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(true);
        }, 1000);
    });
}

export function postRegister(email: string, username: string, password: string): Promise<boolean> {

    localStorage.setItem("user", JSON.stringify({ username: "testUser" }));

    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(true);
        }, 1000);
    });
}
    