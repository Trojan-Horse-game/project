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
    const indx = game.players[action.target[0]].getBase(action.slotTarget[0]);
    let state = game.players[action.target[0]].base[indx].addVirus(action.card);
    if (state === State.Empty) game.discardBase([indx]);
    if (state === State.Generator)
      game.deck.unshift(game.currentPlayer.base[indx].cards[1]);

    game.discardHand([action.indexInHand]);
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
