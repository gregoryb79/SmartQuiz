import { GeneralButton } from './components/GeneralButton';
import styles from './Register.module.scss';
import favicon from "../assets/favicon.png";
import { useLoaderData, useNavigate, useRevalidator } from 'react-router';
import { useDoRegister } from '../hooks/useLogIn';
import { Spinner } from './components/Spinner';
import { useEffect, useState } from 'react';
import { ErrorMsg } from './components/ErrorMsg';


export function Register() {   

    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const [showError, setShowError] = useState(false);
    
    const username = useLoaderData<string>();
    useEffect(() => {
        if (username) {
            console.log(`User is already logged in as ${username}. Redirecting to home page...`);
            navigate("/");
        }
    }, [username]);

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {                     
        event.preventDefault();
        console.log("Register button clicked");
        const formData = new FormData(event.currentTarget);        
        const email = formData.get("email") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string; 
        const repeatPassword = formData.get("repeatPassword") as string;       
        console.log(`email = ${email}, username = ${username}, password = ${password}, repeatPassword = ${repeatPassword}`);            
        doRegister(email, username, password, repeatPassword);
    }

    const {error,loading: loadingRegister, doRegister } = useDoRegister(() => {
        revalidate();
        navigate("/");
    });

    useEffect(() => {
        if (error) {
            console.error("Error during login:", error);
            setShowError(true);
        }
    }, [error]);

    return (
        <main className={styles.registerContainer}>
            <h2>Register</h2>            
            {loadingRegister && <Spinner/>} 
            <form className={styles.registerForm} onSubmit={handleRegister}>
                <section>
                    <label htmlFor="email">e-mail:</label>
                    <input type="e-mail" id="email" name="email" placeholder="Enter your e-mail" aria-label="Enter your email" required />
                </section>
                <section>
                    <label htmlFor="username">Username:</label>
                    <input type="username" id="username" name="username" placeholder="Select username" aria-label="Select your username" required />
                </section>
                <section>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required />
                </section>
                <section>
                    <label htmlFor="repeatPassword">Repeat password:</label>
                    <input type="password" id="repeatPassword" name="repeatPassword" placeholder="Repeat password" required />
                </section>
                <GeneralButton label="Register"/>                
                            
            </form>

            <img className={styles.appIcon} src={favicon} alt="application icon" />
            {showError && error && <ErrorMsg message={error} onOk={() => {setShowError(false)}} />}
            
        </main>
    );
}