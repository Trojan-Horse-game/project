import "./pre-start";
import "reflect-metadata";
import app from "@server"
import cors from "cors";
import path from "path";

// Démarre le server
const port = Number(process.env.PORT || 3000);

const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", function(req:any, res:any) {
  res.sendFile(path.resolve("../client/index.html"));
});

app.use(cors());

io.on("connection", function(socket:any) {
  // When a user connects
  console.log("a user connected");

  // When a user sends a message
  socket.on("chat message", function(msg:any) {
    console.log("message: " + msg);
  });

  // When a user disconnects
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(port, function() {
  console.log("listening on *:"+port);
});
