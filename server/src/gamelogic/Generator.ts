import { Card, Color } from "./Card";

/* A class for the generator cards */
export class Generator implements Card {
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
        return "Générateur d'air";
      case Color.Water:
        return "Générateur d'eau";
      case Color.Energy:
        return "Générateur d'énergie";
      case Color.Radiation:
        return "Générateur de bouclier antiradiation";
      case Color.Joker:
        return "Générateur joker";
      default:
        // Normally never
        return "Générateur unkown";
    }
  }
}
