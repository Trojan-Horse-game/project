/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./pre-start";
import "reflect-metadata";
import app from "./Server";
import cors from "cors";
import path from "path";
import usersRouter from "./routes/user.routes";
import { createConnection } from "typeorm";
import { Socket } from "socket.io";
import { Game } from "./gamelogic/Game";
import { Player, Species } from "./gamelogic/Players";

const port = Number(process.env.PORT || 3000);
const http = require("http").Server(app);

const io = require("socket.io")(http);

let games: Array<Game> = [];

// Finds a game from a roomId
function findGame(roomId: string): Game {
  for (let game of games) {
    if (game.roomId == roomId) {
      return game;
    }
  }
  throw new Error("ERROR : Could not find game !");
}

// Finds a player in a game from a socketId
function findPlayer(socketId: string, thisgame: Game): Player {
  for (let player of thisgame.players) {
    if (socketId == player.socketid) {
      return player;
    }
  }
  throw new Error("ERROR : Could not find player !");
}

io.on("connection", async (socket: Socket) => {
  console.log("a user connected");
  // When creating a new game
  socket.on("create game", async (pseudo: string, species: Species) => {
    socket.join("ROOM-" + socket.id);
    let game = new Game();
    game.roomId = "ROOM-" + socket.id;
    let player = new Player(pseudo, species, socket.id);
    // Assume that specie has already been chosen (to implement in client)
    game.addPlayer(player);
    games.push(game);
    io.to(socket.id).emit("game id", game.roomId);
    console.log("a user created the game : " + game.roomId);
  });

  // When joining a game
  socket.on("join game", async (pseudo: string, roomId: string) => {
    let thisgame = findGame(roomId);
    io.to(socket.id).emit("available species", thisgame.availableSpecies);
    socket.join(thisgame.roomId);

    io.on("choose species", async (species: Species) => {
      let player = new Player(pseudo, species, socket.id);
      thisgame.addPlayer(player);
      io.to(socket.id).emit("game id", thisgame.roomId);
      io.to(thisgame.roomId).emit("join game", player.pseudo, player.species);
      console.log("a user joined the game " + thisgame.roomId);
    });
  });

  // when the game begins
  socket.on("launch game", async (roomId: string) => {
    let thisgame = findGame(roomId);
    thisgame.init();
    for (let player of thisgame.players) {
      io.to(player.socketid).emit("hand", player.hand);
      io.to(thisgame.roomId).emit("base", player.base);
    }
  });

  // when a user updates the game
  socket.on("update game", async (roomId: string) => {
    // TODO : Find out the objects and the methods which we will use
  });

  // When a user sends a message on the chat
  socket.on("chat message", function (roomId: string, msg: string) {
    let player = findPlayer(socket.id, findGame(roomId));
    io.to(roomId).emit("chat message", player.pseudo, msg);
  });

  // When a user discconnects
  socket.on("disconnecting", (_reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        let thisgame = findGame(room);
        let player = findPlayer(socket.id, thisgame);
        let idx = thisgame.players.indexOf(player);
        thisgame.players.splice(idx, 1);
        socket.to(room).emit("disconnect", socket.id);
      }
    }
  });
});

createConnection();
app.use("/api/users", usersRouter);

app.get("/", function (res: any) {
  res.sendFile(path.resolve("./src/index.html"));
});

app.use(cors());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
http.listen(port, async () => {
  console.log("Express server started on port: " + port);
});
