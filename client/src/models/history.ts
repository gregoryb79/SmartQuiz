type QuizHistoryItem = {
  _id: string;            
  score: number;          
  total: number;          
  category: string;       
  difficulty: string;
  durationMinutes: number; 
  createdAt: string;      
  passed: boolean;        
};

export type QuizHistory = QuizHistoryItem[];

const mockQuizHistory: QuizHistoryItem[] = [
  {
    _id: "1",
    score: 10,
    total: 10,
    category: "Science",
    difficulty: "Hard",
    durationMinutes: 5,
    createdAt: "2025-05-20T14:30:00Z",
    passed: true
  },
  {
    _id: "2",
    score: 7,
    total: 10,
    category: "General",
    difficulty: "Medium",
    durationMinutes: 4,
    createdAt: "2025-05-19T18:10:00Z",
    passed: false
  },
  {
    _id: "3",
    score: 8,
    total: 10,
    category: "History",
    difficulty: "Easy",
    durationMinutes: 3.5,
    createdAt: "2025-05-18T09:45:00Z",
    passed: true
  },
  {
    _id: "4",
    score: 6,
    total: 10,
    category: "Math",
    difficulty: "Medium",
    durationMinutes: 6,
    createdAt: "2025-05-17T20:00:00Z",
    passed: false
  }
];

export async function getHistory(): Promise<QuizHistoryItem[]> {
    
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(mockQuizHistory);
        }, 1000);
    });   
  
}