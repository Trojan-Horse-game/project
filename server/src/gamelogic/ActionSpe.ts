import { Carte, Couleur } from "./Carte";

export class ActionSpe implements Carte {
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
        return "Distraction nucléaire";
      case Couleur.Eau:
        return "Usurpation d’identité";
      case Couleur.Energie:
        return "Échange forcé";
      case Couleur.Radiation:
        return "Emprunt à durée indéfinie";
      case Couleur.Joker:
        return "Nettoyage des systèmes";
      default:
        //Impossible normalement
        return "Action unkown";
    }
  }
}
