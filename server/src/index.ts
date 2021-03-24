/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./pre-start";
import "reflect-metadata";
import app from "./Server";
import cors from "cors";
import path from "path";
import { Request, Response } from "express";
import { createConnection } from "typeorm";

const port = Number(process.env.PORT || 3000);
const http = require("http").Server(app);
const io = require("socket.io")(http);
require("./routes/game.routes")(io);

createConnection();

app.get("/", function (req: Request, res: Response) {
  res.sendFile(path.resolve("./src/index.html"));
});

app.use(cors());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
http.listen(port, async () => {
  console.log("Express server started on port: " + port);
});
