import { use } from "react";
import { apiClient } from "./apiClient";

export type Question = {
    _id: string;
    question: string;
    answers: string[]; 
    correctAnswer: number;
    category: string;   
    difficulty: number;
}

const usedQuestions: string[] = [];

export function resetUsedQuestions() {
    usedQuestions.length = 0;
}

export async function getQuestion(category:string, difficulty:number, streak : number): Promise<Question> {
    console.log("Fetching question with params:", { category, difficulty, streak});

     const res = await apiClient.post("/questions", {
        category,
        difficulty,
        streak,
        usedQuestions
    });   

    const question = res.data as Question;   
    usedQuestions.push(question._id);
    console.log("New question: ", question);
    console.log("Used questions: ", usedQuestions);

    return question;    
  
}

export async function getQuizCategories(): Promise<string[]> {
   
    console.log("Fetching quiz categories...");
    const res = await apiClient.get("/questions");
    console.log("Categories fetched:", res.data.categories);

    return res.data.categories as string[];    
}

const questions: Question[] = [
    {
        _id: "1",
        question: "What is the capital city of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: 2,
        category: "Geography",
        difficulty: 1
    },
    {
        _id: "2",
        question: "Which planet is known as the Red Planet?",
        answers: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        category: "Science",
        difficulty: 1
    },
    {
        _id: "3",
        question: "Who wrote the play 'Romeo and Juliet'?",
        answers: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
        correctAnswer: 0,
        category: "Literature",
        difficulty: 2
    },
    {
        _id: "4",
        question: "What is the largest mammal in the world?",
        answers: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctAnswer: 1,
        category: "Biology",
        difficulty: 1
    },
    {
        _id: "5",
        question: "Which element has the chemical symbol 'O'?",
        answers: ["Gold", "Oxygen", "Silver", "Iron"],
        correctAnswer: 1,
        category: "Science",
        difficulty: 1
    },
    {
        _id: "6",
        question: "How many continents are there on Earth?",
        answers: ["5", "6", "7", "8"],
        correctAnswer: 2,
        category: "Geography",
        difficulty: 1
    },
    {
        _id: "7",
        question: "What is the boiling point of water at sea level in Celsius?",
        answers: ["90°C", "100°C", "110°C", "120°C"],
        correctAnswer: 1,
        category: "Science",
        difficulty: 1
    },
    {
        _id: "8",
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswer: 2,
        category: "Art",
        difficulty: 2
    },
    {
        _id: "9",
        question: "Which language is primarily spoken in Brazil?",
        answers: ["Spanish", "Portuguese", "French", "English"],
        correctAnswer: 1,
        category: "Geography",
        difficulty: 1
    },
    {
        _id: "10",
        question: "What is the smallest prime number?",
        answers: ["0", "1", "2", "3"],
        correctAnswer: 2,
        category: "Mathematics",
        difficulty: 1
    },
    {
        _id: "11",
        question: "What is the capital city of Japan?",
        answers: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        correctAnswer: 2,
        category: "Geography",
        difficulty: 1
    },
    {
        _id: "12",
        question: "Who discovered penicillin?",
        answers: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Albert Einstein"],
        correctAnswer: 1,
        category: "Science",
        difficulty: 2
    },
    {
        _id: "13",
        question: "What is the largest planet in our solar system?",
        answers: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 2,
        category: "Science",
        difficulty: 1
    },
    {
        _id: "14",
        question: "Who wrote 'Pride and Prejudice'?",
        answers: ["Jane Austen", "Charlotte Brontë", "Emily Dickinson", "Virginia Woolf"],
        correctAnswer: 0,
        category: "Literature",
        difficulty: 2
    },
    {
        _id: "15",
        question: "What is the chemical symbol for gold?",
        answers: ["Au", "Ag", "Fe", "Hg"],
        correctAnswer: 0,
        category: "Science",
        difficulty: 1
    }
];