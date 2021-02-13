import "./pre-start";
import app from "@server";
import log from "@shared/Logger";
import { exit } from "process";
import { lancerPartie } from "./gamelogic/partie";

// Démarre le server
const port = Number(process.env.PORT || 3000);
let serveur = app.listen(port, async () => {
  log.info("Express server started on port: " + port);
  await lancerPartie();

  serveur.close(() => {
    log.info("Express stopped server");
  });
  exit(0);
});
