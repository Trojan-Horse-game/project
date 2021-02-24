/* eslint-disable @typescript-eslint/no-unsafe-call */
import app from "../Server";
import request from "supertest";
import { User } from "../entity/user";
import { createConnection } from "typeorm";

let user = {
  username: "username",
  password: "password",
  games: 0,
  wins: 0,
};

beforeAll(() => {
  createConnection();
  request(app).post("/api/users/signup").send(user);
});

describe("GET users/", () => {
  it("Should return a list of users", async () => {
    const result = await request(app).get("/api/users/");
    expect(result.status).toEqual(200);
  });
});

describe("GET users/:id", () => {
  it("Should return a user", async () => {
    const result = await request(app).get("/api/users/1");
    expect(result.status).toEqual(200);
  });
});

describe("POST users/signup", () => {
  it("Should insert a new user in the database", async () => {
    let user2 = {
      username: "username2",
      password: "password",
      games: 0,
      wins: 0,
    };
    const result = await request(app).post("/api/users/signup").send(user2);
    expect(result.status).toEqual(200);
  });
});

describe("POST users/signin", () => {
  it("Should return a connexion token", async () => {
    const result = await request(app).post("/api/users/signin").send(user);
    expect(result.status).toEqual(200);
  });
});

describe("PUT users/:id", () => {
  let userUpdate = {
    games: 1,
  };
  it("Should modify a user in the database", async () => {
    const result = await request(app).post("/api/users/1").send(userUpdate);
    expect(result.status).toEqual(200);
  });
});

describe("DELETE users/:id", () => {
  it("Should delete a user from the database", async () => {
    const result = await request(app).delete("/api/users/1");
    expect(result.status).toEqual(200);
  });
});
