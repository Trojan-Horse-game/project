// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { User } from "../entity/user";
import * as bcrypt from "bcrypt";
import { createConnection } from "typeorm";
import jwt from "jsonwebtoken";

// Router Definition
const usersRouter = Router();

// GET users/
usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    let connection = await createConnection();
    console.log("Loading users from the database");
    let users = await connection.manager.find(User);
    console.log("Loaded users: ", users);
  } catch (error) {
    console.error(error);
  }
});

// GET users/:id
usersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    let connection = await createConnection();
    console.log("Loading users from the database...");
    let user = await connection.manager.findOne(User, req.body.id);
    console.log("Loaded user: ", user);
  } catch (error) {
    console.error(error);
  }
});

// POST users/
usersRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    let connection = await createConnection();
    if (await connection.manager.findOne(User, req.body.username)) {
      return res.status(401).json({ error: "Username existe déjà !" });
    }
    console.log("Hashing a new user's passwod");
    let hash = await bcrypt.hash(req.body.password, 10);
    let user = new User();
    user.username = req.body.email;
    user.password = hash;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
  } catch (error) {
    console.error(error);
  }
});

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
                  token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
                    expiresIn: "24h",
                  }),
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
