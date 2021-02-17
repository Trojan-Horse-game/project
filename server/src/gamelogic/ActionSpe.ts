import { Card, Color } from "./Card";

export class ActionSpe implements Card {
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
