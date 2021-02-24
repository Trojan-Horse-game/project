/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./pre-start";
import "reflect-metadata";
import app from "./Server";
import cors from "cors";
import path from "path";

import usersRouter from "./routes/user.routes";
import { createConnection } from "typeorm";

const http = require("http").Server(app);
const io = require("socket.io")(http);
require("./routes/game.route")(io);

createConnection();
app.use('/api/users', usersRouter);

app.get("/", function (res: any) {
  res.sendFile(path.resolve("./src/index.html"));
});

app.use(cors());

// Start the server
const port = Number(process.env.PORT || 3000);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
http.listen(port, async () => {
  console.log("Express server started on port: " + port);
});
