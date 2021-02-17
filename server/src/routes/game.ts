// Required External Modules and Interfaces
import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { createConnection } from "typeorm";

// Router Definition
const gamesRouter = Router();

export default gamesRouter;
