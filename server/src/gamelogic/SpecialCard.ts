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
