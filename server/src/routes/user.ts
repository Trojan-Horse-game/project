// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { User } from "../entity/user";
import * as bcrypt from "bcrypt";
import { createConnection, getConnection } from "typeorm";
import jwt from "jsonwebtoken";
import { create } from "domain";

// Connection creation
async function Connection() {
  try{
    await createConnection();
  } catch (error) {
    console.log(error);
  }
}

// Router Definition
const usersRouter = Router();

// GET users/
usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    console.log("Loading users from the database");
    const users = await connection.manager.find(User);
    res.status(200).json({ users: users });
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

// GET users/:id
usersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const connection = await createConnection();
    console.log("Loading users from the database...");
    const user = await connection.manager.findOne(User, req.body.id);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }
    res.status(200).json({ user_id: user.id, username: user.username });
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

// POST users/
usersRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const connection = await createConnection();
    if (await connection.manager.findOne(User, req.body.username)) {
      return res.status(401).json({ error: "Username existe déjà !" });
    }
    console.log("Hashing a new user's passwod");
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User();
    user.username = req.body.email;
    user.password = hash;
    await connection.manager.save(user);
    res.status(200).json({ user_id: user.id, username: user.username });
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

usersRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const connection = await createConnection();
    const user = await connection.manager.findOne(User, req.body.username);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    }
    res.status(200).json({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

// PUT users/:id
usersRouter.put("/:id", async (req: Request, res: Response) => {
  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ username: "" })
    .where("id = :id", { id: 1 })
    .execute();
  return res.json("OK");
});

// DELETE users/:id
usersRouter.delete("/:id", async (req: Request, res: Response) => {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: 1 })
    .execute();
  return res.json("OK");
});

// TODO : A voir si on veut gérer les amitiés ici ou dans des routes séparées

export default usersRouter;
