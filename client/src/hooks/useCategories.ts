import { useEffect, useState } from "react";
import { getQuestion, getQuizCategories, type Question } from "../models/questions";

export function useCategories() {

    const [categories, setCategories] = useState<string[]>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        let isCanceled = false;
        console.log(`Fetching categories`);        
       
        async function fetchCategories() {
            setCategories(undefined);
            setError(undefined);
            setLoading(true);

            try {
                const categories = await getQuizCategories();
                console.log("Fetched categories:", categories);
                setCategories(categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setError("Failed to fetch categories. Please try again later.");
            }finally {
                setLoading(false);
            }

        }        
        fetchCategories();
        return () => {
          isCanceled = true;
        };
    }, []);

    return { categories, loading, setLoading, error };
}