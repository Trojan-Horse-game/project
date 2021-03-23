// Required External Modules and Interfaces
import { Socket } from "socket.io";
import { Action } from "src/gamelogic/Action";
import { Card } from "src/gamelogic/Card";
import { Game } from "../gamelogic/Game";
import { Player, Species } from "../gamelogic/Players";

let games: Game[] = [];

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
    // TODO : Vérifier que l'user a un token d'authentification valide ?
    // When creating a new game
    socket.on("create game", (pseudo: string, species: Species) => {
      // TODO : Empêcher de créer une partie si on est déjà dans une autre
      try {
        socket.join("ROOM-" + socket.id);
        let game = new Game("ROOM-" + socket.id);
        let player = new Player(pseudo, species, socket.id);
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
      // TODO : Empêcher de rejoindre une partie si on est déjà dans une autre
      try {
        let thisgame = findGame(roomId, games);
        socket.emit("available species", thisgame.availableSpecies);
        socket.join(thisgame.roomId);

        io.on("choose species", (species: Species) => {
          let player = new Player(pseudo, species, socket.id);
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
      try {
        let thisgame = findGame(roomId, games);
        thisgame.init();
        for (let player of thisgame.players) {
          io.to(player.socketid).emit("hand", player.hand);
          io.in(thisgame.roomId).emit("base", player.base);
        }
      } catch (err) {
        io.to(socket.id).emit("oops", err);
      }
    });

    // when a user plays a card
    socket.on("play card", (roomId: string, action: Action) => {
      try {
        let thisgame = findGame(roomId, games);
        let player = findPlayer(socket.id, thisgame);

        if (player !== thisgame.currentPlayer) {
          let error = "Ce n'est pas le tour du joueur";
          io.to(socket.id).emit("oops", error);
        } else {
          thisgame.checkAction(action);
          socket.to(roomId).emit("playCard", action);

          thisgame.playAction(action);
          io.to(socket.id).emit("cardPlayed", thisgame.currentPlayer.hand);

          if (thisgame.inProgress) {
            io.in(roomId).emit("nextTurn", thisgame.currentPlayer);
          } else {
            io.in(roomId).emit("endGame", thisgame.winnerIdx);
          }
        }
      } catch (err) {
        io.to(socket.id).emit("oops", err);
      }
    });

    // when a user discard
    socket.on("discard", (roomId: string, indexDiscard: number[]) => {
      try {
        let thisgame = findGame(roomId, games);
        let player = findPlayer(socket.id, thisgame);

        if (player !== thisgame.currentPlayer) {
          let error = "Ce n'est pas le tour du joueur";
          io.to(socket.id).emit("oops", error);
        } else {
          thisgame.checkDiscard(indexDiscard);

          let index: number;
          let cards: Card[] = [];
          for (index of indexDiscard) {
            cards.push(thisgame.currentPlayer.hand[index]);
          }

          socket.to(roomId).emit("discard", indexDiscard, cards);

          thisgame.discardHand(indexDiscard);
          io.to(socket.id).emit("discarded", thisgame.currentPlayer.hand);

          thisgame.endTurn();
          io.in(roomId).emit("nextTurn", thisgame.currentPlayer);
        }
      } catch (err) {
        io.to(socket.id).emit("oops", err);
      }
    });

    // When a user forfeit from the game on purpose
    socket.on("abbandon", (room: string) => {
      try {
        let player = findPlayer(socket.id, findGame(room, games));
        forfeit(io, room, socket);
      } catch (err) {
        io.to(socket.id).emit("oops", err);
      }
    });

    // When a user sends a message on the chat
    socket.on("chat message", (roomId: string, msg: string) => {
      try {
        let player = findPlayer(socket.id, findGame(roomId, games));
        io.in(roomId).emit("chat message", player.pseudo, msg);
      } catch (err) {
        io.to(socket.id).emit("oops", err);
      }
    });

    // When a user disconnects from the game
    socket.on("disconnecting", (_reason) => {
      for (const room of socket.rooms) {
        if (room == socket.id) {
          forfeit(io, room, socket);
        }
      }
    });
  });
};

// Make a player resign and check for the end of the game
function forfeit(io: any, room: string, playerSocket: Socket) {
  try {
    let thisgame = findGame(room, games);
    let player = findPlayer(playerSocket.id, thisgame);
    let idx = thisgame.players.indexOf(player);

    if (idx == thisgame.currentPlayerIdx) {
      thisgame.resign();
      playerSocket.to(room).emit("disconnect", playerSocket.id);

      if (thisgame.inProgress) {
        io.in(room).emit("nextTurn", thisgame.currentPlayer);
      } else {
        io.in(room).emit("endGame", thisgame.winnerIdx);
      }
    } else {
      thisgame.resign(idx);
      playerSocket.to(room).emit("disconnect", playerSocket.id);

      if (!thisgame.inProgress) {
        io.in(room).emit("endGame", thisgame.winnerIdx);
      }
    }
  } catch (err) {
    io.to(playerSocket.id).emit("oops", err);
  }
}
//TODO: optimiser l'envoi de paquets
