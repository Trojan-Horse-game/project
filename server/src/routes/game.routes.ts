// Required External Modules and Interfaces
import { Socket } from "socket.io";
import { Action } from "../gamelogic/Action";
import { Card, Color } from "../gamelogic/Card";
import { FirewallCard } from "../gamelogic/FirewallCard";
import { GeneratorCard } from "../gamelogic/GeneratorCard";
import { SpecialCard } from "../gamelogic/SpecialCard";
import { VirusCard } from "../gamelogic/VirusCard";
import { Game } from "../gamelogic/Game";
import { Player, Species } from "../gamelogic/Players";

let games: Game[] = [];
let ids: Set<string> = new Set();

export function nextGameID(): string {
  let candidate: string;
  do {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for ( var i = 0; i < 6; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
      characters.length)));
    }
    candidate = result.join('');
  } while (ids.has(candidate))
  ids.add(candidate);
  return candidate;
}

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

export function howManyGames(username: string, games: Game[]): number {
  let count = 0;
  for (const game of games) {
    for (const player of game.players) {
      if (player.pseudo == username) {
        count++;
      }
    }
  }
  return count;
}

// Make a player resign and check for the end of the game
function forfeit(io: any, room: string, playerSocket: Socket) {
  try {
    let thisgame = findGame(room, games);
    let player = findPlayer(playerSocket.id, thisgame);
    let idx = thisgame.players.indexOf(player);

    if (idx == thisgame.currentPlayerIdx) {
      thisgame.resign();
      playerSocket.to(room).emit("leaveGame", idx);
      playerSocket.leave(room);
      clearTimeout(thisgame.timer);

      if (thisgame.inProgress) {
        nextTurn(io, thisgame);
      } else {
        io.in(room).emit("end game", thisgame.winnerIdx);
      }
    } else {
      thisgame.resign(idx);
      playerSocket.to(room).emit("leaveGame", idx);
      playerSocket.leave(room);

      if (!thisgame.inProgress) {
        io.in(room).emit("endGame", thisgame.winnerIdx);
        clearTimeout(thisgame.timer);
        games.splice(games.indexOf(thisgame), 1);
      }
    }
  } catch (err) {
    io.to(playerSocket.id).emit("oops", err);
  }
}

// Envoie l'index du prochain joueur et gère le cas de la distraction nucléaire
function nextTurn(io: any, thisGame: Game) {
  clearTimeout(thisGame.timer);
  do {
    thisGame.endTurn();

    let current = thisGame.currentPlayer;
    io.in(thisGame.roomId).emit("nextTurn", thisGame.currentPlayerIdx);

    if (thisGame.currentPlayer.hand.length === 0) {
      thisGame.draw(3);
      io.to(current.socketId).emit("hand", {
        hand: current.hand,
        kind: cardsKinds(current.hand),
      });
    }
  } while (thisGame.currentPlayer.hand.length === 0);
  if (thisGame.inProgress) {
    thisGame.timer = setTimeout(() => {
      if(thisGame.inProgress)
        nextTurn(io, thisGame);
    }, 20000);
  } else {
    clearTimeout(thisGame.timer);
  }
}

function cardsKinds(cards: Card[]): string[] {
  return cards.map((value) => {
    if (value instanceof FirewallCard) {
      return "firewall";
    } else if (value instanceof GeneratorCard) {
      return "generator";
    } else if (value instanceof VirusCard) {
      return "virus";
    } else if (value instanceof SpecialCard) {
      return "action";
    } else {
      throw "Unexpected type";
    }
  });
}

module.exports = function (io: any) {
  io.on("connection", (socket: Socket) => {
    if (socket.rooms.size > 1) {
      socket.emit("closeTab");
    }

    // When creating a new game
    socket.on("create game", (pseudo: string) => {
      try {
        let count = howManyGames(pseudo, games);
        if (count > 1) {
          socket.emit("closeTab");
          throw "Already in a game !";
        }
        const room = "ROOM-" + nextGameID();
        socket.join(room);
        let game = new Game(room);
        socket.emit("gameId", game.roomId);
        socket.emit("youAreOwner", true);
        socket.emit("availableSpecies", game.availableSpecies);

        socket.on("choose species", (species: Species) => {
          try {
            let player = new Player(pseudo, species, socket.id);
            game.addPlayer(player);
            games.push(game);
          } catch (err) {
            socket.emit("oops", err);
          }
        });
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When joining a game
    socket.on("join game", (data: any) => {
      try {
        const pseudo: string = data.pseudo;
        const roomId: string = data.roomId;
        let thisgame = findGame(roomId, games);
        if (thisgame.players.length == 6) {
          throw "Room is full !";
        }
        const count = howManyGames(pseudo, games);
        if (count > 0) {
          socket.emit("closeTab");
          throw "Already in a game !";
        }
        socket.emit("valid");
        socket.emit("availableSpecies", thisgame.availableSpecies);

        socket.on("choose species", (species: Species) => {
          try {
            let player = new Player(pseudo, species, socket.id);
            thisgame.addPlayer(player);
            socket.join(thisgame.roomId);
            socket.emit("gameId", thisgame.roomId);

            socket.emit("players", {
              pseudo: thisgame.players.map((value) => {
                return value.pseudo;
              }),
              species: thisgame.players.map((value) => {
                return value.species;
              }),
              index: thisgame.players.findIndex((value) => {
                return value.socketId == socket.id;
              }),
            });
            socket.to(thisgame.roomId).emit("joinGame", {
              pseudo: player.pseudo,
              species: player.species,
            });
          } catch (err) {
            socket.emit("oops", err);
          }
        });
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // when the game begins
    socket.on("launch game", (roomId: string) => {
      try {
        let thisgame = findGame(roomId, games);
        if (thisgame.roomId != "ROOM-" + socket.id) {
          throw "Not the host !";
        }
        if (thisgame.players.length == 1) {
          throw "Not enough players !";
        }

        thisgame.init();
        thisgame.players.forEach((player, index) => {
          io.to(player.socketId).emit("hand", {
            hand: player.hand,
            kind: cardsKinds(player.hand),
          });
          io.in(thisgame.roomId).emit("base", {
            base: player.base.map((value)=>{
              value.isSuper = value.cards.findIndex((card)=>card.color == Color.Joker) != -1
              return value;
            }),
            idx: index,
          });
        });
        nextTurn(io, thisgame);
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When a user selects a card
    socket.on("check card", (data: any) => {
      try {
        const roomId: string = data.roomId;
        const action: Action = data.action;
        let thisgame = findGame(roomId, games);
        let player = findPlayer(socket.id, thisgame);

        try {
          if (player !== thisgame.currentPlayer) {
            throw "Not your turn !";
          } else {
            let result = thisgame.checkAction(action);
            socket
              .to(socket.id)
              .emit("checkCard", { action: action, result: result });
          }
        } catch (err) {
          socket.emit("oopsGame", err);
        }
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // when a user plays a card
    socket.on("play card", (data: any) => {
      try {
        const roomId: string = data.roomId;
        const action: Action = data.action;
        let thisgame = findGame(roomId, games);
        let player = findPlayer(socket.id, thisgame);
        action.card = player.hand[action.indexInHand];

        try {
          if (player !== thisgame.currentPlayer) {
            throw "Not your turn !";
          } else {
            thisgame.checkAction(action);
            socket.emit("valid");
            const currCard = player.hand[action.indexInHand];
            if(currCard instanceof SpecialCard && currCard.color == Color.Air){
              for (const player of thisgame.players) {
                if (player.socketId != socket.id) {
                  io.in(roomId).emit("discard", {pseudo: player.pseudo, indexDiscard: [0, 1, 2], cards: player.hand, kinds: cardsKinds(player.hand) })
                }
              }
              clearTimeout(thisgame.timer);
              thisgame.timer = setTimeout(() => {
                nextTurn(io, thisgame);
              }, 2000);
            } else {
              socket.to(roomId).emit("playCard", action);
  
              thisgame.playAction(action);
  
              thisgame.players.forEach((player, index) => {
                io.in(thisgame.roomId).emit("base", {
                  base: player.base.map((value)=>{
                    value.isSuper = value.cards.findIndex((card)=>card.color == Color.Joker) != -1
                    return value;
                  }),
                  idx: index,
                });
              });
  
              if (thisgame.inProgress) {
                const currentPlayerIdxCopy = thisgame.currentPlayerIdx;
                nextTurn(io, thisgame);
                const lastPlayer = thisgame.players[currentPlayerIdxCopy];
                io.to(lastPlayer.socketId).emit("hand", {
                  hand: lastPlayer.hand,
                  kind: cardsKinds(lastPlayer.hand),
                });
              } else {
                clearTimeout(thisgame.timer);
                io.in(roomId).emit("endGame", thisgame.winnerIdx);
              }

            }
          }
        } catch (err) {
          socket.emit("oopsGame", err);
        }
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // when a user discard
    socket.on("discard", (data: any) => {
      try {
        const roomId: string = data.roomId;
        const indexDiscard: number[] = data.indexDiscard;
        let thisgame = findGame(roomId, games);
        let player = findPlayer(socket.id, thisgame);

        try {
          if (player !== thisgame.currentPlayer) {
            throw "Not your turn !";
          } else {
            thisgame.checkDiscard(indexDiscard);
            socket.emit("valid");

            let index: number;
            let cards: Card[] = [];
            for (index of indexDiscard) {
              cards.push(thisgame.currentPlayer.hand[index]);
            }

            thisgame.discardHand(indexDiscard);
            socket
            .to(roomId)
            .emit("discard", { pseudo: player.pseudo, indexDiscard: indexDiscard, cards: cards, kinds: cardsKinds(cards) });
            
            if (thisgame.inProgress) {
              const currentPlayerIdxCopy = thisgame.currentPlayerIdx;
              nextTurn(io, thisgame);
              const lastPlayer = thisgame.players[currentPlayerIdxCopy];
              io.to(lastPlayer.socketId).emit("hand", {
                hand: lastPlayer.hand,
                kind: cardsKinds(lastPlayer.hand),
              });
            } else {
              clearTimeout(thisgame.timer);
              io.in(roomId).emit("endGame", thisgame.winnerIdx);
            }
          }
        } catch (err) {
          socket.emit("oopsGame", err);
        }
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When a user forfeit from the game on purpose
    socket.on("abbandon", (room: string) => {
      try {
        for (const room of socket.rooms) {
          if (room !== socket.id) {
            forfeit(io, room, socket);
          }
        }
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    // When a user sends a message on the chat
    socket.on("chat message", (roomId: string, msg: string) => {
      try {
        let player = findPlayer(socket.id, findGame(roomId, games));
        io.in(roomId).emit("chatMessage", player.pseudo, msg);
      } catch (err) {
        socket.emit("oops", err);
      }
    });

    socket.on("leave game", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on("gameState", (pseudo: string) => {
      let count = howManyGames(pseudo, games);
      if (socket.rooms.size >= 2 && count > 1) socket.emit("inGame");
      else if (socket.rooms.size < 2 && count == 0) socket.emit("restricted");
    });

    //When a user disconnects from the game
    socket.on("disconnecting", (_reason) => {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          forfeit(io, room, socket);
        }
      }
    });
  });
};
