// Required External Modules and Interfaces
import express, { Router } from "express";
import { Request, Response } from "express";
import { User } from "../entity/user";
import { getConnection } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Friendship } from "src/entity/friendship";

// Router Definition
const usersRouter = Router();

usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getConnection().getRepository(User).find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw "Specify id !";
    }
    const results = await getConnection()
      .getRepository(User)
      .findOne(req.params.id);
    if (!results) {
      throw "User not found !";
    }
    res.status(200).send(results);
  } catch (err) {
    res.status(400).send(err);
  }
});

usersRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    if (!(req.body.username && req.body.password)) {
      throw "Invalid data format !";
    }
    const takenUsername = await getConnection()
      .getRepository(User)
      .find({
        where: { username: req.body.username },
      });
    if (takenUsername.length > 0) {
      throw "Username already taken !";
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const user = new User();
    user.username = req.body.username;
    user.password = hash;
    user.games = 0;
    user.wins = 0;
    const results = await getConnection().getRepository(User).save(user);
    res.status(200).send(results);
  } catch (err) {
    return res.status(400).send(err);
  }
});

usersRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    if (!(req.body.username && req.body.password)) {
      throw "Incorrect data format !";
    }
    const user = await getConnection()
      .getRepository(User)
      .find({
        where: { username: req.body.username },
      });
    if (!user) {
      throw "User not found !";
    }
    const valid = await bcrypt.compare(req.body.password, user[0].password);
    if (!valid) {
      throw "Incorrect password !";
    }
    res.status(200).json({
      userId: user[0].id,
      token: jwt.sign({ userId: user[0].id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "24h",
      }),
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// PUT users/:id
usersRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw "Specify id !";
    }
    const user = await getConnection()
      .getRepository(User)
      .findOne(req.params.id);
    if (user) {
      if (req.body.username) {
        const takenUsername = await getConnection()
          .getRepository(User)
          .find({
            where: { username: req.body.username },
          });
        if (takenUsername.length > 0) {
          throw "Username already taken !";
        }
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
      }
      if (req.body.id) {
        throw "Permisison denied !";
      }
      await getConnection().getRepository(User).merge(user, req.body);
      const results = await getConnection().getRepository(User).save(user);
      return res.send(results);
    } else {
      throw "User not found !";
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

usersRouter.put("/looses/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw "Specify id !";
    }
    const user = await getConnection()
      .getRepository(User)
      .findOne(req.params.id);
    if (user) {
      user.games++;
      const results = await getConnection().getRepository(User).save(user);
      return res.send(results);
    } else {
      throw "User not found !";
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

usersRouter.put("/wins/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw "Specify id !";
    }
    const user = await getConnection()
      .getRepository(User)
      .findOne(req.params.id);
    if (user) {
      user.games++;
      user.wins++;
      const results = await getConnection().getRepository(User).save(user);
      return res.send(results);
    } else {
      throw "User not found !";
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

usersRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw "Specify id !";
    }
    const friendships = await getConnection()
      .getRepository(Friendship)
      .find({
        where: [{ user1_id: req.params.id }, { user2_id: req.params.id }],
      });

    for(const one of friendships){
      await getConnection()
      .getRepository(Friendship)
      .delete(one.id);
    }

    const results = await getConnection()
      .getRepository(User)
      .delete(req.params.id);
    res.status(200).send(results);
  } catch (err) {
    res.status(400).send(err);
  }
});

export default usersRouter;
