jest.mock("../middleware/auth", () => ({
  auth: () => (req: any, res: any, next: any) => next(),
}));

import request from "supertest";
import express from "express";
import { router as questionsRouter } from "./questions.router";
import { Question } from "../models/question";

// Mock dependencies
jest.mock("../models/question");

const app = express();
app.use(express.json());
app.use("/questions", questionsRouter);

describe("Questions Router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /questions", () => {
    it("should return categories if found", async () => {
      (Question.distinct as jest.Mock).mockResolvedValue(["Science", "Art"]);
      const res = await request(app).get("/questions");
      expect(res.status).toBe(200);
      expect(res.body.categories).toEqual(["Science", "Art"]);
    });

    it("should return 404 if no categories found", async () => {
      (Question.distinct as jest.Mock).mockResolvedValue([]);
      const res = await request(app).get("/questions");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/no categories found/i);
    });

    it("should return 500 on error", async () => {
      (Question.distinct as jest.Mock).mockRejectedValue(new Error("DB error"));
      const res = await request(app).get("/questions");
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/internal server error/i);
    });
  });

  describe("POST /questions", () => {
    it("should return a question if found", async () => {
      const fakeQuestion = { _id: "1", question: "What is 2+2?", answers: ["3", "4", "5", "6"], correctAnswer: 1, category: "Math", difficulty: 1 };
      (Question.aggregate as jest.Mock).mockResolvedValue([fakeQuestion]);
      const res = await request(app)
        .post("/questions")
        .send({ category: "Math", difficulty: 1, streak: 1, usedQuestions: [] });
      expect(res.status).toBe(200);
      expect(res.body.question).toBe("What is 2+2?");
    });

    it("should return 404 if no question found", async () => {
      (Question.aggregate as jest.Mock).mockResolvedValue([]);
      const res = await request(app)
        .post("/questions")
        .send({ category: "Math", difficulty: 1, streak: 1, usedQuestions: [] });
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/no question found/i);
    });

    it("should return 500 on error", async () => {
      (Question.aggregate as jest.Mock).mockRejectedValue(new Error("DB error"));
      const res = await request(app)
        .post("/questions")
        .send({ category: "Math", difficulty: 1, streak: 1, usedQuestions: [] });
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/internal server error/i);
    });

   it("should build the correct filter for the request", async () => {
    const aggregateMock = jest.spyOn(Question, "aggregate").mockResolvedValue([{
        _id: "1",
        question: "Sample?",
        answers: ["a", "b", "c", "d"],
        correctAnswer: 0,
        category: "Math",
        difficulty: 2
    }]);

    const reqBody = {
        category: "Math",
        difficulty: 2,
        streak: 1,
        usedQuestions: ["123"]
    };

    await request(app)
        .post("/questions")
        .send(reqBody);

    expect(aggregateMock).toHaveBeenCalledWith([
        {
        $match: {
            category: reqBody.category,
            difficulty: reqBody.difficulty,
            _id: { $nin: reqBody.usedQuestions }
        }
        },
        { $sample: { size: 1 } }
    ]);
    });


  });

    it("should build the correct filter for the request adjusted to streak", async () => {
        const aggregateMock = jest.spyOn(Question, "aggregate").mockResolvedValue([{
            _id: "1",
            question: "Sample?",
            answers: ["a", "b", "c", "d"],
            correctAnswer: 0,
            category: "Math",
            difficulty: 2
        }]);

        const reqBody = {
            category: "Math",
            difficulty: 1,
            streak: 3,
            usedQuestions: ["123"]
        };

        await request(app)
            .post("/questions")
            .send(reqBody);

        expect(aggregateMock).toHaveBeenCalledWith([
            {
            $match: {
                category: reqBody.category,
                difficulty: 2,
                _id: { $nin: reqBody.usedQuestions }
            }
            },
            { $sample: { size: 1 } }
        ]);
    });
  
});

