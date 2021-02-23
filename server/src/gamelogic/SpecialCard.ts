import { Card, Color } from "./Card";
import { Action } from "./Action";
import { Game } from "./Game";
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
      //identity theft => 2 players exchange their hands
      [game.currentPlayer.base, game.players[action.target[0]].base] = [
        game.players[action.target[0]].base,
        game.currentPlayer.base,
      ];
    }
    if (action.card.color === Color.Joker) {
      //Systeme cleaning => put virus as most as i can to other players generators
      //const indx = game.players[action.target[0]].getBase(action.slotTarget[0]);
      for (let i = 0; i < action.target.length; i += 2) {
        const card =
          game.players[action.target[i]].base[action.slotTarget[2 * i]]
            .cards[1];
        game.players[action.target[i]].base[
          action.slotTarget[2 * i + 1]
        ].addVirus(card);
        game.players[action.target[i]].base[
          action.slotTarget[2 * i]
        ].cards.splice(1, 1);
        game.discardHand([action.indexInHand]);
      }
    }
    if (action.card.color === Color.Radiation) {
      // Indefinite term loan => steal a non iminized-generator from another player
      game.currentPlayer.base[action.slotTarget[0]] =
        game.players[action.target[0]].base[action.slotTarget[0]];

      game.discardHand([action.indexInHand]);
    }

    if (action.card.color === Color.Energy) {
      // forced exchange => steal a generator from another player
      game.players[action.target[0]].base[action.slotTarget[0]] =
        game.players[action.target[1]].base[action.slotTarget[0]];

      game.discardHand([action.indexInHand]);
    }
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
