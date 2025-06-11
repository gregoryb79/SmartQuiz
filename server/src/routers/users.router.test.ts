jest.mock("../middleware/auth", () => ({
  auth: () => (req: any, res: any, next: any) => next(),
}));

import request from "supertest";
import express from "express";
import { router as usersRouter } from "./users.router";
import { User } from "../models/user";

// Mock dependencies
jest.mock("../models/user");

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

describe("Users Router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /users/scores/:userId", () => {
    it("should return 404 if no users found", async () => {
      (User.find as jest.Mock).mockReturnValue({
            sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
         }),
        }); 

      console.log("should return 404 if no users found");
      const res = await request(app).get("/users/scores/123");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/No users found/i);
    });

    it("should return top 10 users if user is in top 10", async () => {
      const users = Array.from({ length: 10 }, (_, i) => ({
        _id: `${i}`,
        username: `user${i}`,
        totalScore: 100 - i,
        rank: -1,
        toString() { return this._id; }
      }));

      
      (User.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(users)
        })
      });

      console.log("should return top 10 users if user is in top 10");
      const res = await request(app).get("/users/scores/1");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(10);
      expect(res.body[2].rank).toBe(3);
    });

    it("should return peer users if user is not in top 10", async () => {
      const topUsers = Array.from({ length: 10 }, (_, i) => ({
        _id: `${i}`,
        username: `user${i}`,
        totalScore: 100 - i,
        rank: -1,
        toString() { return this._id; }
      }));
      const allUsers = Array.from({ length: 20 }, (_, i) => ({
        _id: `${i}`,
        username: `user${i}`,
        totalScore: 100 - i,
        rank: -1,
        toString() { return this._id; }
      }));

      
      const sortMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue(topUsers);

      
      const sortOnlyMock = jest.fn().mockResolvedValue(allUsers);

      (User.find as jest.Mock).mockImplementation(() => ({
        sort: jest.fn().mockImplementation(function () {          
          return {
            limit: jest.fn().mockResolvedValue(topUsers),            
            then: (resolve: any) => resolve(allUsers),
            catch: () => {},
          };
        }),
      }));
      console.log("should return peer users if user is not in top 10");
      const res = await request(app).get("/users/scores/15");
      expect(res.status).toBe(200);
      expect(res.body[9].rank).toBeGreaterThanOrEqual(9);
    });
  });

  describe("PUT /users/score", () => {
    it("should update user score", async () => {
      const saveMock = jest.fn();
      (User.findById as jest.Mock).mockResolvedValue({
        totalScore: 10,
        lastScore: 0,
        totalGames: 1,
        topScore: 10,
        save: saveMock,
      });
      console.log("should update user score");
      const res = await request(app)
        .put("/users/score")
        .send({ userId: "123", score: 5 });
      expect(res.status).toBe(200);
      expect(saveMock).toHaveBeenCalled();
      expect(res.body.message).toMatch(/score updated/i);
    });

    it("should return 404 if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);
      console.log("should return 404 if user not found");
      const res = await request(app)
        .put("/users/score")
        .send({ userId: "notfound", score: 5 });
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/user not found/i);
    });
  });

  describe("POST /users/register", () => {
    it("should return 400 if missing fields", async () => {
      const res = await request(app)
        .post("/users/register")
        .send({ email: "", username: "", password: "" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if password does not fit rules", async () => {
      const res = await request(app)
        .post("/users/register")
        .send({ email: "a@b.com", username: "user", password: "short" });
      expect(res.status).toBe(400);
    });

    it("should return 409 if user exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(true);
      const res = await request(app)
        .post("/users/register")
        .send({ email: "a@b.com", username: "user", password: "Password1" });
      expect(res.status).toBe(409);
    });
  });

  describe("POST /users/login", () => {
    it("should return 400 if missing fields", async () => {
      const res = await request(app)
        .post("/users/login")
        .send({ email: "", password: "" });
      expect(res.status).toBe(400);
    });

    it("should return 401 if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const res = await request(app)
        .post("/users/login")
        .send({ email: "a@b.com", password: "Password1" });
      expect(res.status).toBe(401);
    });
  });
});