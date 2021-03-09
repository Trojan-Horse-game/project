/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./pre-start";
import "reflect-metadata";
import app from "./Server";
import cors from "cors";
import path from "path";
import usersRouter from "./routes/user.routes";
import { createConnection } from "typeorm";

const port = Number(process.env.PORT || 3000);
const http = require("http").Server(app);

const io = require("socket.io")(http);
require("./routes/game.routes")(io);

createConnection();
app.use("/api/users", usersRouter);

// app.get("/", function (res: any) {
//   res.sendFile(path.resolve("./src/index.html"));
// });

app.use(cors());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
http.listen(port, async () => {
  console.log("Express server started on port: " + port);
});
