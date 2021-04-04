// Required External Modules and Interfaces
import express, { Router } from "express";
import { Request, Response } from "express";

import { getConnection } from "typeorm";
import { Friendship } from "src/entity/friendship";

const friendshipRouter = Router();

/*friendshipRouter.get("/", async (req: Request, res: Response) => {
  try {
    const friendship = await getConnection().getRepository(Friendship).find();
   res.status(200).json(friendship);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

friendshipRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const results = await getConnection()
      .getRepository(Friendship)
      .findOne(req.params.id);
    if (!results) {
      throw "User has no friends !";
    }
    res.status(200).send(results);
  } catch (err) {
    res.status(400).send(err);
  }
});*/

friendshipRouter.post("/add", async (req: Request, res: Response) => {
  try {
    const friendship = new Friendship();
    //friendship.id = 1;
    friendship.user1_id = req.body.user1_id;
    friendship.user2_id = req.body.user2_id;

    const results = await getConnection()
      .getRepository(Friendship)
      .save(friendship);
  } catch (err) {
    return res.status(400).send(err);
  }
});

friendshipRouter.delete("/:friend_id", async (req: Request, res: Response) => {
  const results = await getConnection()
    .getRepository(Friendship)
    .delete(req.params.user1_id);
});

export default friendshipRouter;
