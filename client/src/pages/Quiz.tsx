import { useLocation, useNavigate } from "react-router";
import styles from "./Quiz.module.scss";
import { QuizButton } from "./components/QuizButton";
import { GeneralButton } from "./components/GeneralButton";
import { useEffect, useState } from "react";
import { Confirm } from "./components/Confirm";

export function Quiz() {   

    const navigate = useNavigate()
    const location = useLocation();
    const { category, difficulty } = location.state || {};    
    const question = "What is the capital of France?";
    const timerValue = 15; // is seconds
    const totalSteps = 10; // total number of steps in the quiz
    const [selected, setSelected] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(timerValue); // in seconds 
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [correctAnswers, setCorrectAnswer] = useState<number>(3); 
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    useEffect(() => {
        if (timeLeft <= 0) {            
            console.log("Time's up!");
            const data = new FormData();
            data.set("answer", selected);
            submitAnswer(data);
            setSelected("");
            setTimeLeft(timerValue);
            setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps));
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
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${(currentStep / totalSteps) * 100}%` }}/>
            </div>
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

            <section className={styles.quizFooter}>
                
                <p className={styles.quizScore}>Total Score: {(100*correctAnswers/totalSteps)+"%"}</p>
                <GeneralButton label="Quit Quiz" onClick={() => setShowConfirm(true)}/>
            </section>

            {showConfirm && (<Confirm question={(totalSteps-currentStep) < 4 
                ? `Are you sure? Only ${totalSteps-currentStep} question to go!`
                : `Are you sure?`} 
                onYes = {() => {
                            navigate("/");
                            setShowConfirm(false);}
                }
                onNo = {() => setShowConfirm(false)}
                />)}           
        </main>
    );
}