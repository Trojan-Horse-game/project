import { Couleur } from "./Carte";

export class CaseBase {
  etat: number;
  couleur: Couleur;

  constructor(etat: number, couleur: number) {
    this.etat = etat;
    this.couleur = couleur;
  }
}
