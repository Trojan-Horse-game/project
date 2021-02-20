import { Color, Card } from "./Card";
import { Player } from "./Players";
import { State } from "./BaseSlot";
import { Action } from "./Action";

/* A class for the virus cards */
export class Virus implements Card {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  infect(players: Player[], action: Action): void {
    var idx = action.target[0];
    var idx2 = action.slotTarget[0];
    if (idx === undefined || idx2 === undefined)
      throw new Error("Cette cible n'est pas censé être indéfinie...");

    switch (players[idx].base[idx].state) {
      case State.Generator:
        players[idx].base[idx2].state = State.Virused;
        //Carte a push dans le slotBase, a faire dans Game
        //car pb: comment push un virus si je suis ds la classe virus ?
        break;
      case State.Immunized:
        console.log("Impossible, générateur immunisé");
        break;

      //not supposed to happen
      default:
        console.log("il n'y a pas de generateur a infecter ici");
        break;
    }
  }
  //case when a
  deleteFirewall(players: Player[], action: Action): void {
    var idx = action.target[0];
    var idx2 = action.slotTarget[0];
    if (idx === undefined || idx2 === undefined)
      throw new Error("Cette cible n'est pas censé être indéfinie...");

    if (players[idx].base[idx2].color != this.color) {
      console.log("le generateur selectionné n'as pas la bonne couleur");
      return;
    }

    if (players[idx].base[idx2].state === State.Protected) {
      players[idx].base[idx2].state = State.Generator;
      //cartes a push dans le deck (virus + firewall), a faire dans game surement
      //pblm pour le virus, comment le push ?
    }
  }

  //case when a generator is infected by a virus and we add another
  deleteGenerator(players: Player[], action: Action): void {
    var idx = action.target[0];
    var idx2 = action.slotTarget[0];
    if (idx === undefined || idx2 === undefined)
      throw new Error("Cette cible n'est pas censé être indéfinie...");

    if (players[idx].base[idx2].color != this.color) {
      console.log("le generateur selectionné n'as pas la bonne couleur");
      return;
    }

    if (players[idx].base[idx2].state === State.Virused)
      players[idx].base[idx].state = State.Empty;
    else
      throw new Error(
        "Cette action n'est possible que si le generateur est infecté par 1 et uniquement 1 virus "
      );
    //reste a push les 3 cartes dans le deck (les deux virus, et le generateur detruit)
    //pblm pour le virus, comment le push ?
  }

  action(): void {
    //TODO
    //Je ne sais pas quoi réellement mettre dans la fonction action, en cours de reflexion ...
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
