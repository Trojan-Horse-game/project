import { Card, Color } from "./Card";
import { Action } from "./Action";
import { Game } from "./Game";
import { GeneratorSlot, State } from "./GeneratorSlot";
/* A class for the special action cards

   The color property is used to differentiate every action
*/
export class SpecialCard implements Card {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  action(game: Game, action: Action): void {
    //nuclear distraction ==> All players discard their hands
    if (action.card.color === Color.Air) {
      for (let index = 0; index < game.players.length; index++) {
        if (index != game.currentPlayerIdx) {
          game.discardHand([0, 1, 2], game.players[index]);
        }
      }
    }
    if (action.card.color === Color.Water) {
      //identity theft => 2 players exchange their base
      const tmp = game.currentPlayer.base;
      game.currentPlayer.base = game.players[action.target[0]].base;
      game.players[action.target[0]].base = tmp;
    }
    if (action.card.color === Color.Joker) {
      //Systeme cleaning => put virus as most as i can to other players generators
      for (let i = 0; i < action.target.length; i += 2) {
        const srcSlot = game.currentPlayer.base[action.slotTarget[2 * i]];
        const card = srcSlot.cards[1];

        const dstPlayer = game.players[action.target[i]];
        const dstSlot = dstPlayer.base[action.slotTarget[2 * i + 1]];
        dstSlot.addVirus(card);

        srcSlot.cards.splice(1, 1);
        srcSlot.state = State.Generator;
      }
    }
    if (action.card.color === Color.Radiation) {
      // Indefinite term loan => steal a non iminized-generator from another player
      const srcSlot = game.players[action.target[0]].base[action.slotTarget[0]];
      const dstSlot = game.currentPlayer.base[action.slotTarget[0]];

      dstSlot.state = srcSlot.state;
      dstSlot.cards = srcSlot.cards;

      srcSlot.state = State.Empty;
      srcSlot.cards = [];
    }

    if (action.card.color === Color.Energy) {
      // forced exchange => Exchange two generator slot between two players
      let srcSlot = game.players[action.target[0]].base[action.slotTarget[0]];
      let dstSlot = game.players[action.target[1]].base[action.slotTarget[0]];

      game.players[action.target[0]].base[action.slotTarget[0]] = dstSlot;
      game.players[action.target[1]].base[action.slotTarget[0]] = srcSlot;

      if (action.slotTarget[0] !== action.slotTarget[1]) {
        srcSlot = game.players[action.target[0]].base[action.slotTarget[1]];
        dstSlot = game.players[action.target[1]].base[action.slotTarget[1]];

        game.players[action.target[0]].base[action.slotTarget[1]] = dstSlot;
        game.players[action.target[1]].base[action.slotTarget[1]] = srcSlot;
      }
    }
    game.discardHand([action.indexInHand]);
  }

  toString(): string {
    switch (this.color) {
      case Color.Air:
        return "Nuclear Disctration";
      case Color.Water:
        return "Identity theft";
      case Color.Energy:
        return "Forced exchange";
      case Color.Radiation:
        return "Indefinite term loan";
      case Color.Joker:
        return "System cleaning";
      default:
        // Normally never
        return "Action unkown";
    }
  }
}
