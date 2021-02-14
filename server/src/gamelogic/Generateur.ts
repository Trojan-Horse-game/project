import { Carte, Couleur } from "./Carte";

export class Generateur implements Carte {
  couleur: Couleur;

  constructor(couleur: Couleur) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }
}
