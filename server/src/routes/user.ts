// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response, NextFunction } from "express"
import { User } from "../entity/user"
import * as bcrypt from "bcrypt"
import { createConnection } from "typeorm"
import jwt from "jsonwebtoken"

// Router Definition
const usersRouter = Router()

// GET users/
usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    let connection = await createConnection()
    console.log("Loading users from the database")
    let users = await connection.manager.find(User)
    console.log("Loaded users: ", users)
  } catch (error) {
    console.error(error)
  }
})

// GET users/:id
usersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    let connection = await createConnection()
    console.log("Loading users from the database...")
    let user = await connection.manager.findOne(User, req.body.id)
    console.log("Loaded user: ", user)
  } catch (error) {
    console.error(error)
  }
})

// POST users/
usersRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    let connection = await createConnection()
    if (await connection.manager.findOne(User, req.body.username)) {
      return res.status(401).json({ error: "Username existe déjà !" })
    }
    console.log("Hashing a new user's passwod")
    let hash = await bcrypt.hash(req.body.password, 10)
    let user = new User()
    user.username = req.body.email
    user.password = hash
    await connection.manager.save(user)
    console.log("Saved a new user with id: " + user.id)
  } catch (error) {
    console.error(error)
  }
})

usersRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    let connection = await createConnection()
    let user = await connection.manager.findOne(User, req.body.username)
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" })
    }
    let valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect !" })
    }
    res.status(200).json({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "24h"
      })
    })
  } catch (error) {
    console.error(error)
  }
})

// PUT users/:id
usersRouter.put("/:id", async (req: Request, res: Response) => {
  return res.json("OK")
  // TODO : Pouvoir modifier un champ dans la table user
})

// DELETE users/:id
usersRouter.delete("/:id", async (req: Request, res: Response) => {
  return res.json("OK")
  // TODO : Pouvoir supprimer une entrée de la table user
})

// TODO : A voir si on veut gérer les amitiés ici ou dans des routes séparées

export default usersRouter
