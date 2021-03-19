// Required External Modules and Interfaces
import { Socket } from "socket.io";
import { Game } from "../gamelogic/Game";
import { Player, Species } from "../gamelogic/Players";

let games: Game[] = []

// Finds a game from a roomId
export function findGame(roomId: string, games: Game[]): Game {
  for (let game of games) {
    if (game.roomId == roomId) {
      return game;
    }
  }
  throw "ERROR: Could not find game !";
}

// Finds a player in a game from a socketId
export function findPlayer(socketId: string, thisgame: Game): Player {
  for (let player of thisgame.players) {
    if (socketId == player.socketid) {
      return player;
    }
  }
  throw "ERROR: Could not find player !";
}

module.exports = function (io: any) {
  io.on("connection", (socket: Socket) => {
    // When creating a new game
    socket.on("create game", async (pseudo: string, species: Species) => {
      try {
        socket.join("ROOM-" + socket.id);
        let game = new Game();
        game.roomId = "ROOM-" + socket.id;
        let player = new Player(pseudo, species);
        player.socketid = socket.id
        // Assume that specie has already been chosen (to implement in client)
        game.addPlayer(player);
        games.push(game);
        socket.emit("game id", game.roomId);
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When joining a game
    socket.on("join game", (pseudo: string, roomId: string) => {
      try {
        let thisgame = findGame(roomId, games);
        socket.emit("available species", thisgame.availableSpecies);
        socket.join(thisgame.roomId);

        io.on("choose species", (species: Species) => {
          let player = new Player(pseudo, species);
          player.socketid = socket.id,
          thisgame.addPlayer(player);
          socket.emit("game id", thisgame.roomId);
          io.in(thisgame.roomId).emit(
            "join game",
            player.pseudo,
            player.species
          );
        });
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // when the game begins
    socket.on("launch game", (roomId: string) => {
      let thisgame = findGame(roomId, games);
      thisgame.init();
      for (let player of thisgame.players) {
        io.to(player.socketid).emit("hand", player.hand);
        io.in(thisgame.roomId).emit("base", player.base);
      }
    });

    // when a user updates the game
    socket.on("update game", (roomId: string) => {
      // TODO : Find out the objects and the methods which we will use
    });

    // When a user sends a message on the chat
    socket.on("chat message", (roomId: string, msg: string) => {
      let player = findPlayer(socket.id, findGame(roomId, games));
      io.in(roomId).emit("chat message", player.pseudo, msg);
    });

    // When a user discconnects
    socket.on("disconnecting", (_reason) => {
      for (const room of socket.rooms) {
        if (room == socket.id) {
          let thisgame = findGame(room, games);
          let player = findPlayer(socket.id, thisgame);
          let idx = thisgame.players.indexOf(player);
          thisgame.players.splice(idx, 1);
          socket.to(room).emit("disconnect", socket.id);
        }
      }
    });
  });
};
