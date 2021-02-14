import { Carte, Couleur } from "./Carte";

export class Generateur implements Carte {
  couleur: Couleur;

  constructor(couleur: Couleur) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }

  toString(): string {
    switch (this.couleur) {
      case Couleur.Air:
        return "Générateur d'air";
      case Couleur.Eau:
        return "Générateur d'eau";
      case Couleur.Energie:
        return "Générateur d'énergie";
      case Couleur.Radiation:
        return "Générateur de bouclier antiradiation";
      case Couleur.Joker:
        return "Générateur joker";
      default:
        //Impossible normalement
        return "Générateur unkown";
    }
  }
}
