import { Card, Color } from "./Card";
import { State,GeneratorSlot } from "./GeneratorSlot";
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
    if (action.card.color === Color.Air) {
      for (let index = 0; index < action.target.length; index++) {
        game.discardHand([action.target[index]]);
      }
    }
    if (action.card.color === Color.Water) {
      //échange de toutes les cartes
      [game.currentPlayer.base, game.players[action.target[0]].base] = [
        game.players[action.target[0]].base,
        game.currentPlayer.base,
      ];
    }
    if (action.card.color === Color.Joker){
      const indx = game.currentPlayer.getBase(action.slotTarget[0]);
      const indx2 = game.currentPlayer.getBase(action.target[0]);
      for (let i = 0; i < action.target.length; i +=2) {
        game.currentPlayer.base[action.slotTarget[i+1]].addVirus(action.card);
        
      }
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
