import { useLoaderData } from "react-router";
import styles from "./Profile.module.scss";
import type { User } from "../models/users";
import { AppIcon } from "./components/AppIcon";

export function Profile() {
    
    const profile = useLoaderData<User>();

    if (!profile) {
        return (
            <div className={styles.profileContainer}>
                <h2>Error</h2>
                <p>Profile not found... Please log in or try again.</p>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <h2>{profile.username}</h2>
            <section className={styles.profileDetails}>
                <p><span>Total Score:</span><span>{profile.totalScore}</span></p>
                <p><span>Best Quiz Score:</span><span>{profile.topScore}</span></p>
                <p><span>Last Quiz Score:</span><span>{profile.lastScore}</span></p>
                <p><span>Quizzes Taken:</span><span>{profile.totalGames}</span></p>
                <p><span>Member Since:</span><span>{new Date(profile.createdAt).toLocaleDateString("he-il")}</span></p> 
            </section>
            
            <AppIcon />
        </div>
    );
}