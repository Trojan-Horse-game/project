// Required External Modules and Interfaces
import { Socket } from "socket.io";
import { Action } from "src/gamelogic/Action";
import { Card } from "src/gamelogic/Card";
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
  throw new Error("ERROR : Could not find game !");
}

// Finds a player in a game from a socketId
export function findPlayer(socketId: string, thisgame: Game): Player {
  for (let player of thisgame.players) {
    if (socketId == player.socketid) {
      return player;
    }
  }
  throw new Error("ERROR : Could not find player !");
}

module.exports = function (io: any) {
  io.on("connection", (socket: Socket) => {
    // TODO : Vérifier que l'user a un token d'authentification valide ?
    // When creating a new game
    socket.on("create game", (pseudo: string, species: Species) => {
      // TODO : Empêcher de créer une partie si on est déjà dans une autre
      try {
        socket.join("ROOM-" + socket.id);
        let game = new Game();
        game.roomId = "ROOM-" + socket.id;
        let player = new Player(pseudo, species);
        player.socketid = socket.id //TODO : créer un constructeur pour ça
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
          let player = new Player(pseudo, species); //TODO : changer constructeur
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

    // when a user plays a card
    socket.on("play card",  (roomId: string, action: Action) => {
      let thisgame = findGame(roomId);
      let player = findPlayer(socket.id, thisgame);

      if (player !== thisgame.currentPlayer) {
        let error = new Error("Ce n'est pas le tour du joueur");
        io.to(socket.id).emit("error", error);
      } else {
        try {
          thisgame.checkAction(action);
          socket.to(roomId).emit("playCard", action);

          thisgame.playAction(action);
          io.to(socket.id).emit("cardPlayed", thisgame.currentPlayer.hand);

          io.in(roomId).emit("nextTurn", thisgame.currentPlayer);
        } catch (err) {
          io.to(socket.id).emit("error", err);
        }
      }
    });

    // when a user discard
    socket.on("discard",  (roomId: string, indexDiscard: number[]) => {
      let thisgame = findGame(roomId);
      let player = findPlayer(socket.id, thisgame);

      if (player !== thisgame.currentPlayer) {
        let error = new Error("Ce n'est pas le tour du joueur");
        io.to(socket.id).emit("error", error);
      } else {
        try {
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
        } catch (err) {
          io.to(socket.id).emit("error", err);
        }
      }
    });

    // When a user sends a message on the chat
    socket.on("chat message", (roomId: string, msg: string) => {
      let player = findPlayer(socket.id, findGame(roomId, games));
      io.in(roomId).emit("chat message", player.pseudo, msg);
    });

    // When a user disconnects from the game
    socket.on("disconnecting", (_reason) => {
      for (const room of socket.rooms) {
        if (room == socket.id) {
          let thisgame = findGame(room, games);
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

// TODO : Je crois qu'on peut remplacer les io.to par socket.emit quand on renvoie au sender
