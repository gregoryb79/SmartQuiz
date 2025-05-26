import { useLocation } from "react-router";
import styles from "./Quiz.module.scss";
import { QuizButton } from "./components/QuizButton";
import { GeneralButton } from "./components/GeneralButton";
import { useEffect, useState } from "react";

export function Quiz() {   

    const location = useLocation();
    const { category, difficulty } = location.state || {};
    const question = "What is the capital of France?";
    const timerValue = 15; // is seconds
    const [selected, setSelected] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(timerValue); // in seconds 

    useEffect(() => {
        if (timeLeft <= 0) {            
            console.log("Time's up!");
            submitAnswer(new FormData());
            setSelected(""); // Reset selection
            setTimeLeft(timerValue); // Reset timer
            return;
        }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    async function submitAnswer(formData: FormData) {
        const answer = formData.get("answer");
        console.log(`Submitted answer: ${answer}`);
    }

    return (
        <main className={styles.quizContainer}>
            <section className={styles.quizHeader}>
                <h2 className={styles.quizTitle}>{category} Quiz</h2>
                <div className={styles.timer}>
                    <span>Time Left: </span> 
                    <span className={`${styles.timerValue} ` + (timeLeft > timerValue*0.3 ? styles.good : timeLeft > timerValue*0.1 ? styles.short : styles.none) }>
                        {new Date(timeLeft * 1000).toISOString().substr(14, 5)}
                    </span>
                </div>
            </section>
                        
            <p className={styles.quizQuestion}>{question}</p>
            
            <form className={styles.quizForm} action={submitAnswer}>
                <section className={styles.quizOptions}>
                    <QuizButton label="Paris" name="answer" value="Paris" checked={selected === "Paris"} onChange={setSelected}/>                   
                    <QuizButton label="Rome" name="answer" value="Rome" checked={selected === "Rome"} onChange={setSelected}/>
                    <QuizButton label="Lisbon" name="answer" value="Lisbon" checked={selected === "Lisbon"} onChange={setSelected}/>
                    <QuizButton label="New York" name="answer" value="New York" checked={selected === "New York"} onChange={setSelected}/>                    
                </section>
                <GeneralButton label="Submit Answer"/>
            </form>            
        </main>
    );
}