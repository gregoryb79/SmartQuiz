import { use } from 'react';
import styles from './Leaderboard.module.scss';
import { useLoaderData } from 'react-router';
import { type LeaderBoard } from '../models/scores';

export function Leaderboard() {

    const leaderboard = useLoaderData<LeaderBoard>();

    return (
        <main className={styles.leaderBoardContainer}>
            <h2>🏆 Hall of Fame 🏆</h2>            
            {/* Future implementation will go here */}
            <LeaderoardList leaderboard={leaderboard} />
        </main>
    );
}

type leaderBoardListProps = {
    leaderboard: LeaderBoard;
};
function LeaderoardList({ leaderboard }: leaderBoardListProps) {
    if (!leaderboard.length) {
        return(
            <p>No quiz history yet... Let's do some quizes!</p>
        );
    }

    return (
        <ul className={styles.leadeBoardList}>
            {leaderboard.map((item) => (
                <li key={item._id} className={styles.historyItem}>
                    <span>{item.rank}</span>
                    <span>{item.score}</span>
                    <span>{item.username}</span>                                      
                </li>
            ))}
        </ul>
    );
}