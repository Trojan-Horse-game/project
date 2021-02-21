// Required External Modules and Interfaces
import { Socket } from "socket.io";
import { Game } from "src/gamelogic/Game";
import { Player, Species } from "src/gamelogic/Players";
import app from "../Server";

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
  // When creating a new game
  socket.on("create game", async (player: Player) => {
    socket.join("room" + socket.id);
    let game = new Game();
    game.roomId = "room" + socket.id;
    // Assume that specie has already been chosen (to implement in client)
    game.addPlayer(player);
    io.to(socket.id).emit("Id de la partie : " + game.roomId);
    console.log("a user created the game : " + game.roomId);
  });

  // When joining a game
  socket.on(
    "join game",
    async (socket: Socket, player: Player, roomId: string) => {
      let thisgame = findGame(roomId);
      socket.join(thisgame.roomId);
      io.to(socket.id).emit(thisgame.availableSpecies);
      player.socketid = socket.id;

      io.on("choose species", async (species: Species) => {
        player.species = species;
        thisgame.addPlayer(player);
        io.to(socket.id).emit("Vous avez rejoins la partie " + thisgame.roomId);
        io.to(thisgame.roomId).emit(player.pseudo, player.species);
        console.log("a user joined a the game " + thisgame.roomId);
      });
    }
  );

  // when the game begins
  socket.on("launch game", async (_socket: Socket, roomId: string) => {
    let thisgame = findGame(roomId);
    thisgame.init();
    for (let player of thisgame.players) {
      io.to(player.socketid).emit(player.hand);
      io.to(thisgame.roomId).emit(player.base);
    }
    io.to(thisgame.roomId).emit(thisgame.deck, thisgame.currentPlayer);
  });

  // when a user updates the game
  socket.on("update game", async (socket: Socket, game: Game) => {
    // TODO : Find out the objects and the methods which we will use
  });

  // When a user sends a message on the chat
  socket.on(
    "chat message",
    function (socket: Socket, roomId: string, msg: string) {
      let player = findPlayer(socket.id, findGame(roomId));
      io.to(roomId).emit(player.pseudo, msg);
    }
  );

  // When a user discconnects
  socket.on("disconnecting", (_reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        let thisgame = findGame(room);
        let player = findPlayer(socket.id, thisgame);
        let idx = thisgame.players.indexOf(player);
        thisgame.players.splice(idx, 1);
        socket.to(room).emit("Le joueur", socket.id, "a quitté la partie");
      }
    }
  });
});

export default io;
