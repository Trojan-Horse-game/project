import "./pre-start";
import app from "./Server";
import { exit } from "process";
import { startGame } from "./gamelogic/startGame";


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