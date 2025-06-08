type scoreItem = {
  _id: string;            
  rank: number;          
  score: number;          
  username: string;                
};

export type LeaderBoard = scoreItem[];

const mockLeaderboard: scoreItem[] = [
    {
        _id: "1",
        rank: 1,
        score: 100,
        username: "Alice"
    },
    {
        _id: "2",
        rank: 2,
        score: 90,
        username: "Bob"
    },
    {
        _id: "3",
        rank: 3,
        score: 80,
        username: "Charlie"
    },
    {
        _id: "4",
        rank: 4,
        score: 70,
        username: "David"
    },
    {
        _id: "5",
        rank: 5,
        score: 60,
        username: "Eve"
    }
];

export async function getScores(): Promise<scoreItem[]> {
    
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockLeaderboard);
        }, 1000);
    });   
  
}