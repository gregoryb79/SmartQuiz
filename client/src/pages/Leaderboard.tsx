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
            {leaderboard.map((item,index) => (
                <li key={item._id} className={styles.historyItem}>
                    <span>
                      {index === 0 && (
                        <>
                          <Trophy className={styles.lucideIcon} color="var(--trophy-gold)" /> 1
                        </>
                      )}
                      {index === 1 && (
                        <>
                            <Trophy className={styles.lucideIcon} color="var(--trophy-silver)" /> 2
                        </>                        
                      )}
                      {index === 2 && (
                        <>
                            <Trophy className={styles.lucideIcon} color="var(--trophy-bronze)" /> 3
                        </>
                        
                      )}
                      {[3,4,5,6,7,8,9].includes(index) && index+1}
                    </span>
                    <span>{item.totalScore}</span>
                    <span>{item.username}</span>                                      
                </li>
            ))}
        </ul>
    );
}