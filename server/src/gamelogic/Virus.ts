import { Color, Card } from "./Card";

export class Virus implements Card {
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
