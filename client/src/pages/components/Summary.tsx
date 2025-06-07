import styles from './Summary.module.scss';
import { GeneralButton } from './GeneralButton';
type SummaryProps = {  
  correctAnswers: number;
  totalSteps: number;
  timeLeft?: number;
  score?: number;
  streak?: number;
  onOk?: () => void;         
};
export function Summary({correctAnswers, totalSteps, score, onOk}: SummaryProps) {
    const percentage = Math.round(correctAnswers/totalSteps * 100);
    return (
        <div className={styles.summaryContainer}> 
            <h3>You got {score} points!</h3>
            <p>You answered {correctAnswers} out of {totalSteps} questions correctly.</p>
            {(percentage > 95) && <p>"Congratulations! You are a quiz master!"</p>}
            {(percentage > 80 && percentage <= 95) && <p>"Great job! You have a good knowledge of the subject."</p>}
            {(percentage > 65 && percentage <= 80) && <p>"Not bad! Keep practicing to improve your score."</p>}
            {(percentage <= 65) && <p>"Don't be discouraged! Every quiz is a chance to learn more."</p>}
            <div className={styles.confirmButtons}>
                <GeneralButton label="Ok" onClick={onOk} />                
            </div>
        </div>
    );

}