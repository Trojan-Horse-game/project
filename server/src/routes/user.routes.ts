// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response } from "express";
import { User } from "../entity/user";
import { createConnection, getConnection } from "typeorm";
import jwt from "jsonwebtoken";

// Router Definition
const usersRouter = Router();

// GET users/
usersRouter.get("/", async (req: Request, res: Response) => {
  console.log("Loading users from the database");
  const users = await (await createConnection()).getRepository(User).find();
  res.status(200).json(users);
});

// GET users/:id
usersRouter.get("/:id", async (req: Request, res: Response) => {
  console.log("Loading users from the database...");
  const results = await getConnection()
    .getRepository(User)
    .findOne(req.params.id);
  if (!results) {
    return res.status(401).json({ error: "Utilisateur non trouvé !" });
  }
  res.status(200).send(results);
});

// POST users/
usersRouter.post("/signup", async (req: Request, res: Response) => {
  if (await (await createConnection()).getRepository(User).findOne(req.body.username)) {
    return res.status(401).json({ error: "Username existe déjà !" });
  }
  console.log("Hashing a new user's passwod");
  // const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User();
  user.username = req.body.username;
  // user.password = hash;
  const results = await (await createConnection()).getRepository(User).save(user);
  res.status(200).send(results);
});

usersRouter.post("/signin", async (req: Request, res: Response) => {
  const user = await (await createConnection())
    .getRepository(User)
    .findOne(req.body.username);
  if (!user) {
    return res.status(401).json({ error: "Utilisateur non trouvé !" });
  }
  // const valid = await bcrypt.compare(req.body.password, user.password);
  // if (!valid) {
  //   return res.status(401).json({ error: "Mot de passe incorrect !" });
  // }
  res.status(200).json({
    userId: user.id,
    token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    }),
  });
});

// PUT users/:id
usersRouter.put("/:id", async (req: Request, res: Response) => {
  await (await createConnection())
    .createQueryBuilder()
    .update(User)
    .set({ username: "" })
    .where("id = :id", { id: 1 })
    .execute();
  return res.json("OK");
});

// DELETE users/:id
usersRouter.delete("/:id", async (req: Request, res: Response) => {
  await (await createConnection())
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: 1 })
    .execute();
  return res.json("OK");
});

// TODO : A voir si on veut gérer les amitiés ici ou dans des routes séparées

export default usersRouter;
