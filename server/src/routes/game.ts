// Required External Modules and Interfaces
import { Server, Socket } from "socket.io";
import app from "@server";

// TODO : Create locally a game object to save the current games
// TODO : Link with the game logic

const server = require("http").createServer(app);
const io = require("socket.io")(server);

// join a room
io.on("connection", (socket: Socket) => {
  socket.join("some room"); 
})

// emit to a room
io.to("some room").emit("some event");



