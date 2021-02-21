import { Card, Color } from "./Card";
import { GeneratorSlot, State } from "./GeneratorSlot";

export enum Species {
  Hutex,
  Sonyas,
  Xmars,
  Spectre,
  Ulysse,
  Totox,
}

/* A class to represent a player */
export class Player {
  pseudo: string;
  species: Species;
  hand: Card[] = [];
  base: GeneratorSlot[] = [];

  constructor(pseudo: string, species: Species) {
    let i: number;

    this.species = species;
    this.pseudo = pseudo;

    for (i = 0; i < 5; i++) {
      this.base.push(new GeneratorSlot(State.Empty, i));
    }
  }

  /* Add a card to the player's hand */
  draw(card: Card) {
    this.hand.push(card);
  }

  /* Discard a card of the player's hand */
  discardHand(i: number): Card {
    const oldHand = this.hand[i];
    this.hand.splice(i, 1);
    return oldHand;
  }

  /* Discard the cards of a slot of the base */
  discardBase(i: number): Card[] {
    const oldBase = this.base[i].cards;
    this.base[i].cards = [];
    this.base[i].state = State.Empty;
    return oldBase;
  }

  /* Return the index of a base, based on a color */
  getBase(color: Color) {
    let i: number;

    for (i = 0; i < this.base.length; i++) {
      if (this.base[i].color === color) {
        return i;
      }
    }
    // If we arrive here, something went terribly wrong
    throw "La couleur " + color + "n'existe pas dans la base de " + this.pseudo;
  }

  /* Check if the player won

     Return true if he has, false otherwhise
  */
  checkWin() {
    let generatorValid = 0;
    let i: number;
    for (i = 0; i < this.base.length; i++) {
      if (
        this.base[i].state !== State.Empty &&
        this.base[i].state !== State.Virused
      )
        generatorValid++;
    }
    return generatorValid >= 4;
  }

  /* Display a player's hand */
  displayHand(): void {
    for (let i = 0; i < this.hand.length; i++) {
      console.log(i + " => " + this.hand[i].toString());
    }
  }
}
