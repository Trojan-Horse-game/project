/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./pre-start";
import "reflect-metadata";
import app from "./Server";
import cors from "cors";
import express, { Request, Response } from "express";
import usersRouter from "./routes/user.routes";
import friendshipsRouter from "./routes/friendship.routes";
import { createConnection } from "typeorm";

var whitelist = [
  "https://trojanhorse.cc",
  "https://www.trojanhorse.cc",
  "http://localhost:8081",
  "http://localhost:8080",
  "*",
];

var origin = {
  origin: function (origin: any, callback: any) {
    console.log("CORS", origin, callback);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const port = Number(process.env.PORT || 3000);
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin,
    methods: ["GET", "POST"],
    transports: ["websocket","polling"],
    credentials: true,
  },
  allowEIO3: true,
});

require("./routes/game.routes")(io);
app.use(cors(origin));

createConnection();
app.use("/users", usersRouter);
app.use("/friendships", friendshipsRouter);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

http.listen(port, async () => {
  console.log("Express server started on port: " + port);
});
