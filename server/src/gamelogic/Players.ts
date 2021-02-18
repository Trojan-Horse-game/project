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
  hand: Card[] = [];
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
    this.hand.push(card);
  }

  discardHand(i: number): Card {
    const oldHand = this.hand[i];
    this.hand.splice(i, 1);
    return oldHand;
  }

  discardBase(i: number): Card[] {
    const oldBase = this.base[i].cards;
    this.base[i].cards = [];
    return oldBase;
  }
}
