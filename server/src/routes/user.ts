// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response } from "express";
import { User } from "../entity/user";
import * as bcrypt from "bcrypt";
import { createConnection } from "typeorm";

// Router Definition
let usersRouter = Router();

// Controller Definitions

// GET users/
usersRouter.get("/", async function (req: Request, res: Response) {
  createConnection()
    .then(async (connection) => {
      console.log("Loading users from the database...");
      let users = await connection.manager.find(User);
      console.log("Loaded users: ", users);
    })
    .catch((error) => console.log(error));
});

// GET users/:id
usersRouter.get("/:id", async function (req: Request, res: Response) {
  createConnection()
    .then(async (connection) => {
      console.log("Loading users from the database...");
      let user = await connection.manager.findOne(User, req.body.id);
      console.log("Loaded user: ", user);
    })
    .catch((error) => console.log(error));
});

// POST users/
usersRouter.post("/", async function (req: Request, res: Response) {
  createConnection()
    .then(async function (connection) {
      console.log("Hashing a new user's password");
      bcrypt
        .hash(req.body.password, 10)
        .then(async function (hash) {
          console.log("Inserting a new user into the database...");
          let user = new User();
          user.username = req.body.email;
          user.password = hash;
          await connection.manager.save(user);
          console.log("Saved a new user with id: " + user.id);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

// PUT users/:id
usersRouter.put(
  "/:id",
  async function (req: Request, res: Response, next: any) {
    return res.json("OK");
    // OPTIONAL
  }
);

// DELETE users/:id
usersRouter.delete(
  "/:id",
  async function (req: Request, res: Response, next: any) {
    return res.json("OK");
    // OPTIONAL
  }
);

export default usersRouter;
