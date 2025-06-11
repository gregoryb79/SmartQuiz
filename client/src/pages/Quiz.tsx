import { useLocation, useNavigate, useBlocker, useLoaderData } from "react-router";
import styles from "./Quiz.module.scss";
import { QuizButton } from "./components/QuizButton";
import { GeneralButton } from "./components/GeneralButton";
import { useEffect, useState } from "react";
import { Confirm } from "./components/Confirm";
import { useQuestion } from "../hooks/useQuestion";
import { Summary } from "./components/Summary";
import { resetUsedQuestions } from "../models/questions";
import { ErrorMsg } from './components/ErrorMsg';
import { updateUserScore } from "../models/users";
import { Spinner } from "./components/Spinner";


const timerValueEasy = Number(import.meta.env.VITE_QUIZ_TIME_EASY) || 10;
const timerValueMedium = Number(import.meta.env.VITE_QUIZ_TIME_MEDIUM) || 5;
const timerValueHard = Number(import.meta.env.VITE_QUIZ_TIME_HARD) || 5;

const totalStepsEasy = Number(import.meta.env.VITE_QUIZ_STEPS_EASY) || 10;
const totalStepsMedium = Number(import.meta.env.VITE_QUIZ_STEPS_MEDIUM) || 15;;
const totalStepsHard = Number(import.meta.env.VITE_QUIZ_STEPS_HARD) || 20;


export function Quiz() {   

    const navigate = useNavigate()
    const location = useLocation();
    const { category, difficulty } = location.state || {};       
    const timerValue = difficulty === "1" ? timerValueEasy : difficulty === "2" ? timerValueMedium : timerValueHard; 
    const totalSteps = difficulty === "1" ? totalStepsEasy : difficulty === "2" ? totalStepsMedium : totalStepsHard; 
    
    const answerFeedbackTime = 1000; // time in milliseconds to show answer feedback
    const [selected, setSelected] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(timerValue); // in seconds 
    const [totalTime, setTotalTime] = useState<number>(0); // in seconds
    const [timerActive, setTimerActive] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [correctAnswers, setCorrectAnswer] = useState<number>(0); 
    const [streak, setStreak] = useState<number>(0); 
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [buttonState, setButtonState] = useState<("default" | "correct" | "wrong")[]>(["default", "default", "default", "default"]);
    const [showSummary, setShowSummary] = useState<boolean>(false);
    const [startQuiz, setStartQuiz] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const {question, error: questionError} = useQuestion(category, Number(difficulty), streak, currentStep, totalSteps);
    
    const [showError, setShowError] = useState(false);
    useEffect(() => {
        if (questionError) {
            console.error("Error getting question:", questionError);
            setError(questionError);
            setShowError(true);
        }
    }, [questionError]);

    // console.log(`Current step: ${currentStep}, Total steps: ${totalSteps}, total time: ${totalTime}, streak: ${streak}`);
    
    useEffect(() => {
        if (question) {
            setTimeLeft(timerValue);
            setTimerActive(true);
        }
    }, [question]);

    useEffect(() => {
        console.log("Resetting used questions");
        resetUsedQuestions();
    }, [startQuiz]);

    useEffect(() => {
        if (!timerActive) return;        
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

    const [blockNavigation, setBlockNavigation] = useState<boolean>(true);
    const [pendingNavigation, setPendingNavigation] = useState(false);
    const [nextLocation, setNextLocation] = useState<string>("/");  
    useBlocker((tx) => {
        console.log("Entered useBlocker", tx);
        setNextLocation(tx.nextLocation.pathname);
        if (blockNavigation){
            console.log("Blocking navigation");
            setShowConfirm(true);                    
            return true;   
        }
        return false;              
    });
    useEffect(() => {
        if (!blockNavigation && pendingNavigation) {            
            navigate(nextLocation);                     
            setStartQuiz(false);
            setShowSummary(false);
            setPendingNavigation(false);
    }}, [blockNavigation, pendingNavigation, navigate]);

    const [score, setScore] = useState<number>(0);
    const username = useLoaderData<string>();
    useEffect(() => {
        if (currentStep > totalSteps) {
            console.log("Quiz completed");
            console.log(`Total time: ${totalTime}, Correct answers: ${correctAnswers}, Total steps: ${totalSteps}, time left: ${timerValue*totalSteps-totalTime}, score: ${calculateScore (correctAnswers, totalSteps, timerValue*totalSteps-totalTime, difficulty)}`);
            setScore(calculateScore (correctAnswers, totalSteps, timerValue*totalSteps-totalTime, difficulty));
            setShowSummary(true);
        }
    }, [currentStep]);

    async function handleSummaryOk() {
        setBlockNavigation(false);
        if (username) {
            setLoading(true);
            try {
                console.log("Updating user score...");
                await updateUserScore(score);
                navigate("/leaderboard");
                setStartQuiz(false);
                setShowSummary(false);
            } catch (error) {
                console.error("Error updating user score:", error);
                setError("Failed to update your score. Please try again later.");
                setShowError(true);                
            } finally {
                setLoading(false);
            }
        } else {
            setPendingNavigation(true);
        }
    }

    return (
        <main className={styles.quizContainer}>
            {loading && <Spinner/>} 
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
                
                <p className={styles.quizScore}>{`${correctAnswers} correct of ${totalSteps}`}</p>
                <GeneralButton label="Quit Quiz" onClick={() => setShowConfirm(true)}/>
            </section>

            {showConfirm && (<Confirm question={(totalSteps-currentStep) < 4 
                ? `Are you sure? Only ${totalSteps-currentStep} question to go!`
                : `Are you sure?`} 
                onYes = {() => {
                            setBlockNavigation(false);
                            setPendingNavigation(true);
                        }
                }
                onNo = {() => setShowConfirm(false)}
                />)}  

            {showSummary && (
                <Summary
                    correctAnswers={correctAnswers}
                    totalSteps={totalSteps}
                    timeLeft={timerValue - totalTime}
                    score={score}
                    onOk={handleSummaryOk}
                />
            )}
            {showError && error && <ErrorMsg message={error} onOk={() => {
                setShowError(false)
                if (showSummary) {
                    setPendingNavigation(true);                                       
                }
            }} />}
        </main>
    );
}

function calculateScore(correctAnswers: number, totalSteps: number, timeLeft: number, difficulty: string): number {
    const difficultyFactor = difficulty === "1" ? 1 : difficulty === "2" ? 1.5 : 2;
    const timeFactor = timeLeft/10 * difficultyFactor; 
    const score = (correctAnswers / totalSteps) * 100;
    return Math.round((1+timeFactor) * score); 
}

