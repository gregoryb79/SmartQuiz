import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { GeneralButton } from "./components/GeneralButton";
import styles from "./Home.module.scss";
import favicon from "../assets/favicon.png";

export function Home() {
    const [username, setUsername] = useState<string | null>("Username");
    const [difficulty, setDifficulty] = useState<string>("Easy");
    const [category, setCategory] = useState<string>("General");
    const navigate = useNavigate();
    const categories = useLoaderData<string[]>();
    
  return (
   <main className={styles.homeMain}>
        <h2>Welcome, {username} 👋🏻</h2>
        <section className={styles.mainButtons}>
            <GeneralButton label="Start New Quiz" onClick={() => navigate("/new-quiz", { state: { category, difficulty } })}/>
            <GeneralButton label="Leaderboard" onClick={() => navigate("/leaderboard")}/>
        </section>
        <form className={styles.quizForm}>
            <section>
                <label htmlFor="Difficulty:">Start Difficulty:</label>
                <select id="difficulty" name="difficulty" onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>   
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </section>
            <section>
                <label htmlFor="Category:">Category:</label>
                <select id="category" name="category" onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="General">General Knowledge</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}                    
                </select> 
            </section>          
        </form>
        <img className={styles.appIcon} src={favicon} alt="application icon" />
   </main>
  );
}