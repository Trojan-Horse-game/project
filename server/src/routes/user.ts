// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { User } from "../entity/user";
import * as bcrypt from "bcrypt";
import { Connection, createConnection } from "typeorm";

// Router Definition
const usersRouter = Router();

// GET users/
usersRouter.get(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    createConnection()
      .then(async (connection) => {
        console.log("Loading users from the database...");
        let users = await connection.manager.find(User);
        console.log("Loaded users: ", users);
      })
      .catch((error) => console.log(error));
  }
);

// GET users/:id
usersRouter.get(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    createConnection()
      .then(async (connection) => {
        console.log("Loading users from the database...");
        let user = await connection.manager.findOne(User, req.body.id);
        console.log("Loaded user: ", user);
      })
      .catch((error) => console.log(error));
  }
);

// POST users/
usersRouter.post(
  "/signup",
  async function (req: Request, res: Response, next: NextFunction) {
    createConnection()
      .then(async function (connection) {
        let user = await connection.manager
          .findOne(User, req.body.username)
          .then(async function () {
            if (user) {
              return res.status(401).json({ error: "Username existe déjà !" });
            }
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
      })
      .catch((error) => console.log(error));
  }
);

// PUT users/:id
usersRouter.put(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    return res.json("OK");
    // OPTIONAL
  }
);

// DELETE users/:id
usersRouter.delete(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    return res.json("OK");
    // OPTIONAL
  }
);

usersRouter.post(
  "/signin",
  async function (req: Request, res: Response, next: NextFunction) {
    createConnection()
      .then(async function (connection) {
        connection.manager
          .findOne(User, req.body.email)
          .then(async function (user) {
            if (!user) {
              return res
                .status(401)
                .json({ error: "Utilisateur non trouvé !" });
            }
            bcrypt
              .compare(req.body.password, user.password)
              .then(async function (valid) {
                if (!valid) {
                  return res
                    .status(401)
                    .json({ error: "Mot de passe incorrect !" });
                }
                res.status(200).json({
                  userId: user.id,
                  token: "TOKEN",
                });
              })
              .catch((error) => res.status(500).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
);

export default usersRouter;
