import { useLocation, useNavigate, useBlocker } from "react-router";
import styles from "./Quiz.module.scss";
import { QuizButton } from "./components/QuizButton";
import { GeneralButton } from "./components/GeneralButton";
import { useEffect, useRef, useState } from "react";
import { Confirm } from "./components/Confirm";
import { useQuestion } from "../hooks/useQuestion";


const timerValueEasy = Number(import.meta.env.VITE_QUIZ_TIME_EASY) || 15;
const timerValueMedium = Number(import.meta.env.VITE_QUIZ_TIME_MEDIUM) || 10;
const timerValueHard = Number(import.meta.env.VITE_QUIZ_TIME_HARD) || 10;

const totalStepsEasy = 2;//Number(import.meta.env.VITE_QUIZ_STEPS_EASY) || 10;
const totalStepsMedium = Number(import.meta.env.VITE_QUIZ_STEPS_MEDIUM) || 15;;
const totalStepsHard = Number(import.meta.env.VITE_QUIZ_STEPS_HARD) || 20;


export function Quiz() {   

    const navigate = useNavigate()
    const location = useLocation();
    const { category, difficulty } = location.state || {};        
    const timerValue = difficulty === "Easy" ? timerValueEasy : difficulty === "Medium" ? timerValueMedium : timerValueHard; 
    const totalSteps = difficulty === "Easy" ? totalStepsEasy : difficulty === "Medium" ? totalStepsMedium : totalStepsHard; 
    
    const answerFeedbackTime = 1000; // time in milliseconds to show answer feedback
    const [selected, setSelected] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(timerValue); // in seconds 
    const [totalTime, setTotalTime] = useState<number>(0); // in seconds
    const [timerActive, setTimerActive] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>(1);
    // const [qCounter, setQCounter] = useState<number>(0); 
    const [correctAnswers, setCorrectAnswer] = useState<number>(0); 
    const [streak, setStreak] = useState<number>(0); 
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [buttonState, setButtonState] = useState<("default" | "correct" | "wrong")[]>(["default", "default", "default", "default"]);

    const {question,error} = useQuestion(category, difficulty, streak, currentStep, totalSteps);

    // console.log(`Current step: ${currentStep}, Total steps: ${totalSteps}, total time: ${totalTime}, streak: ${streak}`);
    
    useEffect(() => {
        if (question) {
            setTimeLeft(timerValue);
            setTimerActive(true);
        }
    }, [question]);

    useEffect(() => {
        if (!timerActive) return;
        // if (currentStep === totalSteps) return;
        if (timeLeft <= 0) {            
            console.log("Time's up!");
            const data = new FormData();
            data.set("answer", selected);
            submitAnswer(data);
            setSelected("");
            setTimeLeft(timerValue);                    
            return;
        }
        const timer = setTimeout(() => {setTimeLeft(timeLeft - 1); 
                                        setTotalTime(prevTime => prevTime + 1);                       
                                        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, timerActive]);   

    async function submitAnswer(formData: FormData) {
        if (!question) {
            console.error("No question available to submit answer.");
            return;
        }
        const answer = formData.get("answer");
        const currButtonState = [...buttonState];
        setTimerActive(false);
        if (!answer || answer !== question.answers[question.correctAnswer]) {
            console.log(`Wrong answer: ${answer}`);            
            currButtonState[question.correctAnswer] = "wrong";
            setButtonState(currButtonState);            
            setStreak(0);
            setTimeout(() => {
                setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps+1));
                console.log(`Current step: ${currentStep}, Total steps: ${totalSteps}`);
                setButtonState(["default", "default", "default", "default"]);
            }, answerFeedbackTime); 
            setSelected("");            
            return;            
        }       
        currButtonState[question.correctAnswer] = "correct";
        setButtonState(currButtonState);        
        setStreak(currStreak => (currStreak + 1));        
        setTimeout(() => {
                setCurrentStep(prevStep => Math.min(prevStep + 1, totalSteps+1));
                console.log(`Current step: ${currentStep}, Total steps: ${totalSteps}`);
                setButtonState(["default", "default", "default", "default"]);
            }, answerFeedbackTime);        
        setCorrectAnswer(prevCount =>(prevCount + 1));
        console.log(`Submitting answer: ${answer}, current streak: ${streak}`);         
    }   

    let blockNavigation = true;    
    useBlocker((tx) => {
        console.log("Entered useBlocker", tx);
        if (blockNavigation){
            console.log("Blocking navigation");
            setShowConfirm(true);                    
            return true;   
        }
        return false;              
    });

    if (currentStep > totalSteps) {
        console.log("Quiz completed");
    }

    return (
        <main className={styles.quizContainer}>
            <div className={styles.progressBarContainer}>
                <div className={`${styles.progressBar} ` + (streak > 3 ? styles.hard : streak > 2 ? styles.medium : styles.normal)} style={{ width: `${(currentStep / totalSteps) * 100}%` }}/>
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
                        
            <p className={styles.quizQuestion}>{question?.question || "loading question..."}</p>
            
            <form className={styles.quizForm} action={submitAnswer}>
                <section className={styles.quizOptions}>
                    <QuizButton state = {buttonState[0]} label={`${question?.answers[0] || "Loading..."}`} name="answer" value={`${question?.answers[0]}`} checked={selected === `${question?.answers[0]}`} onChange={setSelected}/>                   
                    <QuizButton state = {buttonState[1]} label={`${question?.answers[1] || "Loading..."}`} name="answer" value={`${question?.answers[1]}`} checked={selected === `${question?.answers[1]}`} onChange={setSelected}/>
                    <QuizButton state = {buttonState[2]} label={`${question?.answers[2] || "Loading..."}`} name="answer" value={`${question?.answers[2]}`} checked={selected === `${question?.answers[2]}`} onChange={setSelected}/>
                    <QuizButton state = {buttonState[3]} label={`${question?.answers[3] || "Loading..."}`} name="answer" value={`${question?.answers[3]}`} checked={selected === `${question?.answers[3]}`} onChange={setSelected}/>
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
                            blockNavigation = false;
                            navigate("/");
                            setShowConfirm(false);}
                }
                onNo = {() => setShowConfirm(false)}
                />)}           
        </main>
    );
}

