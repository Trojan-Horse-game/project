import { Card, Color } from "./Card";

/* A class for the firewall cards */
export class Firewall implements Card {
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
        return "Pare-feu d'air";
      case Color.Water:
        return "Pare-feu d'eau";
      case Color.Energy:
        return "Pare-feu d'énergie";
      case Color.Radiation:
        return "Pare-feu de bouclier antiradiation";
      case Color.Joker:
        return "Pare-feu joker";
      default:
        // Normally never
        return "Pare-feu unkown";
    }
  }
}
