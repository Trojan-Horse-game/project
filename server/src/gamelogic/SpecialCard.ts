import { Card, Color } from "./Card";

/* A class for the special action cards

   The color property is used to differentiate every action
*/
export class SpecialCard implements Card {
  color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  action(): void {
    //TODO
  }

  toString(): string {
    switch (this.color) {
      case Color.Air:
        return "Distraction nucléaire";
      case Color.Water:
        return "Usurpation d’identité";
      case Color.Energy:
        return "Échange forcé";
      case Color.Radiation:
        return "Emprunt à durée indéfinie";
      case Color.Joker:
        return "Nettoyage des systèmes";
      default:
        // Normally never
        return "Action unkown";
    }
  }
}
