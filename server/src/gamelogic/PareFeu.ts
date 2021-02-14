import { Carte, Couleur } from "./Carte";

export class PareFeu implements Carte {
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
        return "Pare-feu d'air";
      case Couleur.Eau:
        return "Pare-feu d'eau";
      case Couleur.Energie:
        return "Pare-feu d'énergie";
      case Couleur.Radiation:
        return "Pare-feu de bouclier antiradiation";
      case Couleur.Joker:
        return "Pare-feu joker";
      default:
        //Impossible normalement
        return "Pare-feu unkown";
    }
  }
}
