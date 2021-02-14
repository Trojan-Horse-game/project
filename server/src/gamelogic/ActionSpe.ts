import { Carte, Couleur } from "./Carte";

export class ActionSpe implements Carte {
  couleur: Couleur;

  constructor(couleur: Couleur) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }
}
