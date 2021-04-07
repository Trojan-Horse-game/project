import { Color, Card } from "./Card";
import { State } from "./GeneratorSlot";
import { Action } from "./Action";
import { Game } from "./Game";

/* A class for the virus cards */
export class VirusCard implements Card {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  action(game: Game, action: Action): void {
    const victim = game.players[action.target[0]];
    const indx = victim.getBase(action.slotTarget[0]);
    const state = victim.base[indx].addVirus(action.card);

    if (state === State.Empty) {
      game.deck.unshift(victim.base[indx].cards[0]);
      game.deck.unshift(victim.base[indx].cards[1]);
      game.deck.unshift(victim.base[indx].cards[2]);
      victim.discardBase(indx);
    } else if (state === State.Generator) {
      game.deck.unshift(victim.base[indx].cards[1]);
      game.deck.unshift(victim.base[indx].cards[2]);
      victim.base[indx].cards.splice(1, 2);
    }

    game.currentPlayer.discardHand(action.indexInHand);
  }

  toString(): string {
    switch (this.color) {
      case Color.Air:
        return "Virus d'air";
      case Color.Water:
        return "Virus d'eau";
      case Color.Energy:
        return "Virus d'énergie";
      case Color.Radiation:
        return "Virus de bouclier antiradiation";
      case Color.Joker:
        return "Virus joker";
      default:
        // Normally never
        return "Virus unkown";
    }
  }
}
