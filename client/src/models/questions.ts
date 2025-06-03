export type Question = {
    question: string;
    answers: string[]; 
    correctAnswer: number;   
}

export async function getQuestion(category:string, difficulty:string, streak : number): Promise<Question> {
    
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(questions[Math.floor(Math.random() * questions.length)]);
        }, 1000);
    });   
  
}

const questions: Question[] = [
    {
        question: "What is the capital city of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
    },
    {
        question: "Who wrote the play 'Romeo and Juliet'?",
        answers: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
        correctAnswer: 0
    },
    {
        question: "What is the largest mammal in the world?",
        answers: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctAnswer: 1
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        answers: ["Gold", "Oxygen", "Silver", "Iron"],
        correctAnswer: 1
    },
    {
        question: "How many continents are there on Earth?",
        answers: ["5", "6", "7", "8"],
        correctAnswer: 2
    },
    {
        question: "What is the boiling point of water at sea level in Celsius?",
        answers: ["90°C", "100°C", "110°C", "120°C"],
        correctAnswer: 1
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswer: 2
    },
    {
        question: "Which language is primarily spoken in Brazil?",
        answers: ["Spanish", "Portuguese", "French", "English"],
        correctAnswer: 1
    },
    {
        question: "What is the smallest prime number?",
        answers: ["0", "1", "2", "3"],
        correctAnswer: 2
    }
];