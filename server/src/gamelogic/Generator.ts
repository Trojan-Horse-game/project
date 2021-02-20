import { Action } from "./Action";
import { Card, Color } from "./Card";
import { Game } from "./Game";

/* A class for the generator cards */
export class Generator implements Card {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  /* Pose a generator at the right slot of the player's base 
  
     Discard the generator from the hand of the player
  */
  action(game: Game, action: Action): void {
    let indx = game.currentPlayer.getBase(action.card.color);
    game.currentPlayer.base[indx].addGenerator(action.card);
    game.discardHand([action.indexInHand]);
  }

  toString(): string {
    switch (this.color) {
      case Color.Air:
        return "Générateur d'air";
      case Color.Water:
        return "Générateur d'eau";
      case Color.Energy:
        return "Générateur d'énergie";
      case Color.Radiation:
        return "Générateur de bouclier antiradiation";
      case Color.Joker:
        return "Générateur joker";
      default:
        // Normally never
        return "Générateur unkown";
    }
  }
}
