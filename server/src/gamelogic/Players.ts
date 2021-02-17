import { Card } from "./Card";
import { BaseSlot } from "./BaseSlot";

export const enum Species {
  Hutex,
  Sonyas,
  Xmars,
  Spectre,
  Ulysse,
  Totox,
}

export class Player {
  pseudo: string;
  species: Species;
  main: Card[] = [];
  base: BaseSlot[] = [];

  // TODO : construct an empty base
  constructor(pseudo: string, species: Species) {
    this.species = species;
    this.pseudo = pseudo;
  }

  /* Add a card to the player's hand */
  draw(card: Card) {
    this.main.push(card);
  }
}
