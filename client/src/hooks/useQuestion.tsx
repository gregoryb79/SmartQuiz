import { useEffect, useState } from "react";
import { getQuestion, type Question } from "../models/questions";

export function useQestion(category:string, difficulty: string, streak: number, step: number){

    const [question, setQuestion] = useState<Question>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        let isCanceled = false;
        console.log(`Fetching question for category: ${category}, difficulty: ${difficulty}, streak: ${streak}`);        
       
        async function fetchQuestion() {
            setQuestion(undefined);
            setError(undefined);

            try {
                const question = await getQuestion(category, difficulty, streak);
                console.log("Fetched question:", question.question);
                setQuestion(question);
            } catch (error) {
                console.error("Failed to fetch question:", error);
                setError("Failed to fetch question. Please try again later.");
            }
        }

        fetchQuestion();
         return () => {
          isCanceled = true;
        };
    }, [step]);

    return { question, error };
}