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
    },
    {
        _id: "6",
        rank: 6,
        score: 50,
        username: "Frank"
    },
    {
        _id: "7",
        rank: 7,
        score: 40,
        username: "Grace"
    },
    {
        _id: "8",
        rank: 8,
        score: 30,
        username: "Heidi"
    },
    {
        _id: "9",
        rank: 9,
        score: 20,
        username: "Ivan"
    },
    {
        _id: "10",
        rank: 10,
        score: 10,
        username: "Judy"
    }
];
import { apiClient } from "./apiClient";
export async function getScores(): Promise<scoreItem[]> {

    try {
        const res = await apiClient.get("/leaderboard");
        console.log(res.data);
    }catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
    
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockLeaderboard);
        }, 1000);
    });   
  
}