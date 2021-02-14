import { Carte, Couleur } from "./Carte";

export class Virus implements Carte {
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
        return "Virus d'air";
      case Couleur.Eau:
        return "Virus d'eau";
      case Couleur.Energie:
        return "Virus d'énergie";
      case Couleur.Radiation:
        return "Virus de bouclier antiradiation";
      case Couleur.Joker:
        return "Virus joker";
      default:
        //Impossible normalement
        return "Virus unkown";
    }
  }
}
