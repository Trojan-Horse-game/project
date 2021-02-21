// Required External Modules and Interfaces
import { Socket } from "socket.io";
import { Game } from "src/gamelogic/Game";
import { Player, Species } from "src/gamelogic/Players";
import app from "../Server";

const server = require("http").createServer(app);
const io = require("socket.io")(server);

let games: Array<Game> = [];

function findGame(roomId: string): Game {
  for (let game of games) {
    if (game.roomId == roomId) {
      return game;
    }
  }
  throw new Error("ERROR : Could not find game !");
}

function findPlayer(socket: Socket, thisgame: Game): Player {
  for (let player of thisgame.players) {
    if (socket.id == player.socketid) {
      return player;
    }
  }
  throw new Error("ERROR : Could not find player !");
}

 io.on("connection", async (socket: Socket) => {
  socket.on("create game", async (player: Player) => {
    socket.join("room" + socket.id);
    let game = new Game();
    game.roomId = "room" + socket.id;
    // Assume that specie has already been chosen (to implement in client)
    game.addPlayer(player);
    let id = games.push(game);
    games[id].gameId = id;
    io.to(socket.id).emit("Id de la partie : " + game.roomId);
    console.log("a user created the game : " + game.roomId);
  });

  socket.on(
    "join game",
    async (socket: Socket, player: Player, roomId: string) => {
      let thisgame = findGame(roomId);
      io.to(socket.id).emit(games[thisgame.gameId].availableSpecies);

      io.on("choose species", async (species: Species) => {
        socket.join(thisgame.roomId);
        player.socketid = socket.id;
        thisgame.addPlayer(player);
        io.to(socket.id).emit("Vous avez rejoins la partie " + thisgame.roomId);
        io.to(thisgame.roomId).emit(player.pseudo, player.species);
        console.log("a user joined a the game " + thisgame.roomId);
      });
    }
  );

  // when the game begins
  socket.on("launch game", async (socket: Socket, roomId: string) => {
    let thisgame = findGame(roomId);
    thisgame.init();
    for (let player of thisgame.players) {
      io.to(player.socketid).emit(
        player.hand,
        thisgame.deck,
        thisgame.currentPlayer
      );
      io.to(thisgame.roomId).emit(
        thisgame.deck,
        thisgame.currentPlayer,
        player.base
      );
    }
  });

  // when a user updates the game
  socket.on("update game", async (socket: Socket, game: Game) => {});

  // When a user sends a message
  socket.on(
    "chat message",
    function (socket: Socket, roomId: string, msg: string) {
      let player = findPlayer(socket, findGame(roomId));
      io.to(roomId).emit(player.pseudo, msg);
    }
  );

  socket.on("disconnecting", (reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        switch (reason) {
          case "pingtimeout":
            // TODO : action
            break;
          case "transport close":
            // TODO : action
            break;
        }
        socket.to(room).emit("Le joueur", socket.id, "a quitté la partie");
      }
    }
  });
});

export default io;
