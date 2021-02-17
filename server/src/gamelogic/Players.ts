import { Card } from "./Card";
import { BaseSlot, State } from "./BaseSlot";

export enum Species {
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

  constructor(pseudo: string, species: Species) {
    let i: number;

    this.species = species;
    this.pseudo = pseudo;

    for (i = 0; i < 5; i++) {
      this.base.push(new BaseSlot(State.Empty, i));
    }
  }

  /* Add a card to the player's hand */
  draw(card: Card) {
    this.main.push(card);
  }
}
