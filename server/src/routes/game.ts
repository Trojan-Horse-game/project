// Required External Modules and Interfaces
import { Server, Socket } from "socket.io";
import app from "../Server";

const server = require("http").createServer(app);
const io = require("socket.io")(server);

let games = Array<Game>;

io.on("connection", async (socket: Socket) => {
  socket.on("create game", function (userdata: JSON) {
    socket.join("room" + socket.id);
    let game = new Game;
    game.roomId = "room"+socket.id;
    let player = new Player;
    player.pseudo = userdata.pseudo;
    // not done yet
    io.to(socket.id).emit("Id de la partie : "+game.roomId);
    console.log("a user created the game : "+game.roomId);
  });

  socket.on("join game", async (socket: Socket, userdata: JSON, gamestate: JSON) => {
    socket.join(gamestate.roomId);
    let player = new Player;
    player.pseudo = userdata.pseudo;
    io.to(socket.id).emit("Vous avez rejoins la partie " + gamestate.roomId);
    console.log("a user joined a the game " + gamestate.roomId);
  });

  // when the game begins
  io.on("launch game", async (socket: Socket, gamestate: JSON) => {
    // TODO : Call the function which parses the gamestate
    io.to(gamestate.roomId).emit(games[gamestate.gameId]);
  }); 

  // when a user updates the game
  io.on("update game", async (socket: Socket, gamestate: JSON) => {

    
  });

  // When a user sends a message
  socket.on("chat message", function (socket: Socket, gameInfo: JSON, msg: string) {
      for (let player of games[gameInfo.gameId].players){
        if (player.socketid == socket.id){
          socket.to(gameInfo.roomId).emit(player.pseudo + ":" + msg);
        }
      } 
  });

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
