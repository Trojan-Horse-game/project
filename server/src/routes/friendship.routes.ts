// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Friendship } from "../entity/friendship";

const friendshipsRouter = Router();

friendshipsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const friendships = await getConnection().getRepository(Friendship).find();
    res.status(200).json(friendships);
  } catch (err) {
    res.status(400).send(err);
  }
});

friendshipsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      throw "Specify id !";
    }
    const results = await getConnection()
      .getRepository(Friendship)
      .find({
        where: [{ user1_id: req.params.id }, { user2_id: req.params.id }]
      });
    if (!results) {
      throw "User has no friends !";
    }
    res.status(200).send(results);
  } catch (err) {
    res.status(400).send(err);
  }
});

friendshipsRouter.post("/add", async (req: Request, res: Response) => {
  try {
    if (!(req.body.user1_id && req.body.user2_id)) {
      throw "Invalid data format !";
    }
    const friendshipExists = await getConnection()
      .getRepository(Friendship)
      .find({
        where: [
          { user1_id: req.body.user1_id, user2_id: req.body.user2_id },
          {
            user2_id: req.body.user1_id,
            user1_id: req.params.user2_id
          }
        ]
      });

    if (friendshipExists.length > 0) {
      console.log(friendshipExists);
      throw "Friendship already exists !";
    }

    const friendship = new Friendship();
    friendship.user1_id = req.body.user1_id;
    friendship.user2_id = req.body.user2_id;

    const results = await getConnection()
      .getRepository(Friendship)
      .save(friendship);

    return res.status(200).send(results);
  } catch (err) {
    return res.status(400).send(err);
  }
});

friendshipsRouter.put(
  "/respond/:id1/:id2",
  async (req: Request, res: Response) => {
    try {
      if (!req.body.status) {
        throw "Invalid data format !";
      }
      if (!(req.params.id1 && req.params.id2)) {
        throw "Specify ids !";
      }
      const friendship = await getConnection()
        .getRepository(Friendship)
        .find({
          where: [
            { user1_id: req.params.id1, user2_id: req.params.id2 },
            {
              user2_id: req.params.id1,
              user1_id: req.params.id2
            }
          ]
        });
      if (!friendship) {
        throw "Friendship not found";
      }
      if (friendship.length > 1) {
        throw "Duplicates detected !";
      }
      if (req.body.status == "rejected") {
        const results = await getConnection()
          .getRepository(Friendship)
          .delete(friendship[0]);
        return res.status(200).send(results);
      } else {
        friendship[0].status = "confirmed";
        const results = await getConnection()
          .getRepository(Friendship)
          .save(friendship);
        res.status(200).send(results);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

friendshipsRouter.delete("/:id1/:id2", async (req: Request, res: Response) => {
  try {
    if (!(req.params.id1 && req.params.id2)) {
      throw "Specify ids !";
    }
    const friendship = await getConnection()
      .getRepository(Friendship)
      .find({
        where: [
          { user1_id: req.params.id1, user2_id: req.params.id2 },
          {
            user2_id: req.params.id1,
            user1_id: req.params.id2
          }
        ]
      });
    if (friendship.length == 0) {
      throw "Friendship not found !";
    }
    const results = await getConnection()
      .getRepository(Friendship)
      .delete(friendship[0]);
    return res.status(200).send(results);
  } catch (err) {
    return res.status(400).send(err);
  }
});

export default friendshipsRouter;
