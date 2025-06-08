import { useEffect, useRef, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import { GeneralButton } from "./components/GeneralButton";
import styles from "./Home.module.scss";
import favicon from "../assets/favicon.png";
import { Spinner } from "./components/Spinner";
import { Confirm } from "./components/Confirm";
import { useCategories } from "../hooks/useCategories";

export function Home() {
    const username = useLoaderData<string>();
    const [difficulty, setDifficulty] = useState<string>("Easy");
    const [category, setCategory] = useState<string>("General");
    const navigate = useNavigate();
    const {categories, loading, setLoading, error} = useCategories();
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
       
  return (
   <main className={styles.homeMain}>
        <h2>Welcome{username ? "," : "!"} {username} 👋🏻</h2>
        {loading && <Spinner/>} 
        <section className={styles.mainButtons}>
            {/* <GeneralButton label="Start New Quiz" onClick={() => navigate("/new-quiz", { state: { category, difficulty } })}/> */}
            <GeneralButton label="Start New Quiz" onClick={() => {
                    if (!username) {
                        setShowConfirm(true);
                    } else {
                        navigate("/new-quiz", { state: { category, difficulty } });
                    }
                }}/>                
            <GeneralButton label="Leaderboard" onClick={() => {
                setLoading(true);
                navigate("/leaderboard")}}/>
        </section>
        <form className={styles.quizForm}>
            <section>
                <label htmlFor="Difficulty:">Start Difficulty:</label>
                <select id="difficulty" name="difficulty" onChange={(e) => setDifficulty(e.target.value)} value={difficulty} disabled={loading}>   
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </section>
            <section>
                <label htmlFor="Category:">Category:</label>
                <select id="category" name="category" onChange={(e) => setCategory(e.target.value)} value={category} disabled={loading}>
                    <option value="General">General Knowledge</option>
                    {categories?.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}                    
                </select> 
            </section>          
        </form>
        <img className={styles.appIcon} src={favicon} alt="application icon" />

        {showConfirm && (<Confirm question={"You are not Logged In. No scores will be saved. Do you want to continue?"} 
                        onYes = {() => {                                    
                                    navigate("/new-quiz", { state: { category, difficulty } })
                                    setShowConfirm(false);}}
                        onNo = {() => setShowConfirm(false)}
        />)}  
   </main>
  );
}