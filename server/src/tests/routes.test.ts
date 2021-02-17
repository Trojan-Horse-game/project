/* eslint-disable @typescript-eslint/no-unsafe-call */
import app from "@server";
import request from "supertest";

describe("GET user/", () => {
  it("Should return a list of the users", async () => {
    const result = await request(app).get("api/user/");
    expect(result.status).toEqual(200);
  });
});

describe("GET user/:id", () => {
  it("Should return a user", async () => {
    const result = await request(app).get("api/user/:id");
    expect(result.status).toEqual(200);
  });
});

describe("POST user/signup", () => {
  it("Should return a list of the users", async () => {
    const result = await request(app).get("api/user/signup");
    expect(result.status).toEqual(200);
  });
});

describe("POST user/signin", () => {
  it("Should return a list of the users", async () => {
    const result = await request(app).get("api/user/signin");
    expect(result.status).toEqual(200);
  });
});
