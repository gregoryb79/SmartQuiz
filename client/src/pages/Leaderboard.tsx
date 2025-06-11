import styles from './Leaderboard.module.scss';
import { useLoaderData } from 'react-router';
import { type UserScore } from '../models/users';
import { Trophy } from "lucide-react";

export function Leaderboard() {

    const leaderboard = useLoaderData<UserScore[]>();

    return (
        <main className={styles.leaderBoardContainer}>
            <h2>🏆 Hall of Fame 🏆</h2>            
            {/* Future implementation will go here */}
            <LeaderoardList leaderboard={leaderboard} />
        </main>
    );
}

type leaderBoardListProps = {
    leaderboard: UserScore[];
};
function LeaderoardList({ leaderboard }: leaderBoardListProps) {
    if (!leaderboard.length) {
        return(
            <>
                <p>Ooops, something went wrong and leaderboard not available...</p>
                <p>Try again later...</p>
            </>
        );
    }

    return (
        <ul className={styles.leadeBoardList}>
            {leaderboard.map((item) => (
                <li key={item._id} className={styles.historyItem}>
                    <span className={styles.rankSpan}>
                      {item.rank === 1 && (
                        <>
                          <Trophy className={styles.lucideIcon} color="var(--trophy-gold)" /> 1
                        </>
                      )}
                      {item.rank === 2 && (
                        <>
                            <Trophy className={styles.lucideIcon} color="var(--trophy-silver)" /> 2
                        </>                        
                      )}
                      {item.rank === 3 && (
                        <>
                            <Trophy className={styles.lucideIcon} color="var(--trophy-bronze)" /> 3
                        </>
                        
                      )}
                      {item.rank && item.rank > 3 && item.rank}
                    </span>
                    <span className={styles.scoreSpan}>{item.rank != -1 ? item.totalScore : "--------"}</span>
                    <span>{item.rank != -1 && item.username}</span>                                      
                </li>
            ))}
        </ul>
    );
}