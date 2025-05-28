import { use } from 'react';
import styles from './History.module.scss';
import { useLoaderData } from 'react-router';
import { type QuizHistory } from '../models/history';

export function History() {

    const history = useLoaderData<QuizHistory>();

    return (
        <main className={styles.historyContainer}>
            <h2>🕗Your Quiz History</h2>            
            {/* Future implementation will go here */}
            <HistoryList history={history} />
        </main>
    );
}

type historyProps = {
    history: QuizHistory;
};
function HistoryList({ history }: historyProps) {
    if (!history.length) {
        return(
            <p>No quiz history yet... Let's do some quizes!</p>
        );
    }

    return (
        <ul className={styles.historyList}>
            {history.map((item) => (
                <li key={item._id} className={styles.historyItem}>
                    <span>{item.passed ? "✅" : "❌"}</span>
                    <span>{item.score}/{item.total}</span>
                    <span>{item.category}</span>
                    <span>{item.difficulty}</span>
                    <span>{item.durationMinutes} min</span>                    
                </li>
            ))}
        </ul>
    );
}