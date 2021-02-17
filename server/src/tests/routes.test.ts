/* eslint-disable @typescript-eslint/no-unsafe-call */
import app from "@server";
import request from "supertest";

describe("GET users/", () => {
  it("Should return a list of the users", async () => {
    const result = await request(app).get("api/users/");
    expect(result.status).toEqual(200);
  });
});

describe("GET users/:id", () => {
  it("Should return a user", async () => {
    const result = await request(app).get("api/users/:id");
    expect(result.status).toEqual(200);
  });
});

describe("POST users/signup", () => {
  it("Should insert a new user in the database", async () => {
    const result = await request(app).post("api/users/signup");
    expect(result.status).toEqual(200);
  });
});

describe("POST users/signin", () => {
  it("Should return a token", async () => {
    const result = await request(app).post("api/users/signin");
    expect(result.status).toEqual(200);
  });
});
