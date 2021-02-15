import "./pre-start";
import app from "@server";
import { exit } from "process";
import { lancerPartie } from "./gamelogic/lancePartie";

// Démarre le server
const port = Number(process.env.PORT || 3000);
let serveur = app.listen(port, async () => {
  console.log("Express server started on port: " + port);
  await lancerPartie();

  serveur.close(() => {
    console.log("Express stopped server");
  });
  exit(0);
});
