// Required External Modules and Interfaces
import { Socket } from "socket.io";
import { Action } from "src/gamelogic/Action";
import { Game } from "../gamelogic/Game";
import { Player, Species } from "../gamelogic/Players";

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

module.exports = function (io: any) {
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

    // when a user plays a card
    socket.on("play card", async (roomId: string, action: Action) => {
      // TODO : Find out the objects and the methods which we will use
    });

    // when a user discard
    socket.on("discard", async (roomId: string, action: Action) => {
      // TODO : Find out the objects and the methods which we will use
    });

    // When a user sends a message on the chat
    socket.on("chat message", function (roomId: string, msg: string) {
      let player = findPlayer(socket.id, findGame(roomId));
      io.to(roomId).emit("chat message", player.pseudo, msg);
    });

    // When a user disconnects or abandon the game
    socket.on("disconnecting", (_reason) => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          let thisgame = findGame(room);
          let player = findPlayer(socket.id, thisgame);
          let idx = thisgame.players.indexOf(player);

          if (idx == thisgame.currentPlayerIdx) {
            thisgame.resign();
            socket.to(room).emit("disconnect", socket.id);
            socket.to(room).emit("nextTurn", thisgame.currentPlayerIdx);
          } else {
            thisgame.resign(idx);
            socket.to(room).emit("disconnect", socket.id);
          }
        }
      }
    });
  });
};
