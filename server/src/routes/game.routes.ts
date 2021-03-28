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
    if (socketId == player.socketId) {
      return player;
    }
  }
  throw "ERROR: Could not find player !";
}

// Make a player resign and check for the end of the game
function forfeit(io: any, room: string, playerSocket: Socket) {
  try {
    let thisgame = findGame(room, games);
    let player = findPlayer(playerSocket.id, thisgame);
    let idx = thisgame.players.indexOf(player);

    if (idx == thisgame.currentPlayerIdx) {
      thisgame.resign();
      playerSocket.to(room).emit("leave game", playerSocket.id);

      if (thisgame.inProgress) {
        nextTurn(io, thisgame);
      } else {
        io.in(room).emit("end game", thisgame.winnerIdx);
      }
    } else {
      thisgame.resign(idx);
      playerSocket.to(room).emit("leave game", playerSocket.id);

      if (!thisgame.inProgress) {
        io.in(room).emit("end game", thisgame.winnerIdx);
      }
    }
  } catch (err) {
    io.to(playerSocket.id).emit("oops", err);
  }
}

// Envoie l'index du prochain joueur et gère le cas de la distraction nucléaire
function nextTurn(io: any, thisGame: Game) {
  do {
    thisGame.endTurn();

    let current = thisGame.currentPlayer;
    io.in(thisGame.roomId).emit("next turn", thisGame.currentPlayerIdx);
    io.to(current.socketId).emit("hand", current.hand);

    if (thisGame.currentPlayer.hand.length === 0) {
      //TODO: Envoyer les cartes discard par le jouer à cause de distraction nucléaire
    }
  } while (thisGame.currentPlayer.hand.length === 0);
}

module.exports = function (io: any) {
  io.on("connection", (socket: Socket) => {
    console.log("User " + socket.id + " connected");
    // TODO : Vérifier que l'user a un token d'authentification valide ?

    // When creating a new game
    socket.on("create game", (pseudo: string, speciesIndx: number) => {
      // TODO : Empêcher de créer une partie si on est déjà dans une autre
      try {
        const room = "ROOM-"+socket.id
        socket.join(room);
        let game = new Game(room);
        let player = new Player(pseudo, speciesIndx, socket.id);
        game.addPlayer(player);
        games.push(game);
        console.log(pseudo + " created the game : " + game.roomId);
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

        socket.on("choose species", (species: Species) => {
          let player = new Player(pseudo, species, socket.id);
          thisgame.addPlayer(player);
          socket.join(thisgame.roomId);
          console.log(pseudo + " joined the game " + roomId);
          socket.emit("game id", thisgame.roomId);

          for (let tmp of thisgame.players) {
            socket.emit("players", tmp.pseudo, tmp.species);
          }

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
        if (thisgame.roomId != socket.id) {
          throw "Permission denied : not the host";
        }

        thisgame.init();
        for (let player of thisgame.players) {
          io.to(player.socketId).emit("hand", player.hand);
          io.in(thisgame.roomId).emit("base", player.base);
        }
        io.in(thisgame.roomId).emit("next turn", thisgame.currentPlayerIdx);
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // when a user plays a card
    socket.on("play card", (roomId: string, action: Action) => {
      try {
        let thisgame = findGame(roomId, games);
        let player = findPlayer(socket.id, thisgame);

        if (player !== thisgame.currentPlayer) {
          let error = "Ce n'est pas le tour du joueur";
          socket.emit("oops", error);
        } else {
          thisgame.checkAction(action);
          socket.to(roomId).emit("play card", action);

          thisgame.playAction(action);
          socket.emit("card played", thisgame.currentPlayer.hand);

          if (thisgame.inProgress) {
            nextTurn(io, thisgame);
          } else {
            io.in(roomId).emit("end game", thisgame.winnerIdx);
          }
        }
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // when a user discard
    socket.on("discard", (roomId: string, indexDiscard: number[]) => {
      try {
        let thisgame = findGame(roomId, games);
        let player = findPlayer(socket.id, thisgame);

        if (player !== thisgame.currentPlayer) {
          throw "Ce n'est pas le tour du joueur";
        } else {
          thisgame.checkDiscard(indexDiscard);

          let index: number;
          let cards: Card[] = [];
          for (index of indexDiscard) {
            cards.push(thisgame.currentPlayer.hand[index]);
          }

          socket.to(roomId).emit("discard", indexDiscard, cards);
          thisgame.discardHand(indexDiscard);

          nextTurn(io, thisgame);
        }
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When a user forfeit from the game on purpose
    socket.on("abbandon", (room: string) => {
      try {
        forfeit(io, room, socket);
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When a user sends a message on the chat
    socket.on("chat message", (roomId: string, msg: string) => {
      try {
        let player = findPlayer(socket.id, findGame(roomId, games));
        io.in(roomId).emit("chat message", player.pseudo, msg);
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When a user disconnects from the game
    socket.on("disconnecting", (_reason) => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          forfeit(io, room, socket);
        }
        console.log("User " + socket.id + " disconnected");
      }
    });
  });
};

//TODO : En cas de distraction nucléaire, envoyer les cartes discard
