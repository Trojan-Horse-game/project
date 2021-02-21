/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./pre-start";
import "reflect-metadata";
import app from "./Server";
import cors from "cors";
import path from "path";
import usersRouter from "./routes/user";

app.use('/api/users', usersRouter);

// Démarre le server
const port = Number(process.env.PORT || 3000);

const http = require("http").Server(app);
const io = require("socket.io")(http);

app.get("/", function (req: any, res: any) {
  res.sendFile(path.resolve("../client/index.html"));
});

app.use(cors());

http.listen(port, function () {
  console.log("listening on *:" + port);
});
