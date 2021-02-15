import { Carte } from "./Carte";
import { CaseBase } from "./caseBase";

export const enum Espece {
  Hutex,
  Sonyas,
  Xmars,
  Spectre,
  Ulysse,
  Totox,
}

export class Joueur {
  pseudo: string;
  espece: Espece;
  main: Carte[] = [];
  base: CaseBase[] = [];

  constructor(pseudo: string, espece: Espece) {
    this.espece = espece;
    this.pseudo = pseudo;
  }

  /* Add a card to the player's hand */
  piocher(carte: Carte) {
    this.main.push(carte);
  }
}
