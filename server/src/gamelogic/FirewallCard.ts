import { Card, Color } from "./Card";
import { Game } from "./Game";
import { Action } from "./Action";
import { State } from "./GeneratorSlot";

/* A class for the firewall cards */
export class FirewallCard implements Card {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  action(game: Game, action: Action): void {
    const indx = game.currentPlayer.getBase(action.slotTarget[0]);
    const state = game.currentPlayer.base[indx].addFireWall(action.card);
    if (state === State.Generator) {
      game.deck.unshift(game.currentPlayer.base[indx].cards[1]);
      game.deck.unshift(game.currentPlayer.base[indx].cards[2]);
      game.currentPlayer.base[indx].cards.splice(1, 2);
    }

    game.currentPlayer.discardHand(action.indexInHand);
  }

  toString(): string {
    switch (this.color) {
      case Color.Air:
        return "Pare-feu d'air";
      case Color.Water:
        return "Pare-feu d'eau";
      case Color.Energy:
        return "Pare-feu d'énergie";
      case Color.Radiation:
        return "Pare-feu de bouclier antiradiation";
      case Color.Joker:
        return "Pare-feu joker";
      default:
        // Normally never
        return "Pare-feu unkown";
    }
  }
}
