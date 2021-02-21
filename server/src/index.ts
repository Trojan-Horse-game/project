/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "./pre-start";
import "reflect-metadata";
import app from "./Server";
import cors from "cors";
import path from "path";
import usersRouter from "./routes/user";
import { exit } from "process";
import { startGame } from "./gamelogic/startGame";
import io from "./routes/game";


app.use('/api/users', usersRouter);
app.use('/api/games', io);

app.use(cors());

// Start the server
const port = Number(process.env.PORT || 3000);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = app.listen(port, async () => {
  console.log("Express server started on port: " + port);
  await startGame();

  server.close(() => {
    console.log("Express stopped server");
  });
  exit(0);
});
