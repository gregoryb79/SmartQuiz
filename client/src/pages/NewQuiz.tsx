import { useLocation } from "react-router";

export  function NewQuiz() {
    

    const location = useLocation();
    const { category, difficulty } = location.state || {};

    return (
        <main>
            <h2>New Quiz</h2>
            <p>Category: {category || "General Knowledge"}</p>
            <p>Difficulty: {difficulty || "Easy"}</p>
            <p>Quiz creation functionality is not yet implemented.</p>
            <p>Please check back later!</p>
        </main>
    );
}