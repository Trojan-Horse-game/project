import { ActionSpe } from "./ActionSpe";
import { Carte, Couleur } from "./Carte";
import { Generateur } from "./Generateur";
import { Espece, Joueur } from "./Joueurs";
import { PareFeu } from "./PareFeu";
import { Virus } from "./Virus";

export class Partie {
  joueurs: Joueur[] = [];
  defausse: Carte[] = [];
  pioche: Carte[] = [];
  joueurEnCours: number = 0;

  // Création du deck
  constructor() {
    let distrib: number[][] = [
      [5, Couleur.Air],
      [5, Couleur.Eau],
      [5, Couleur.Energie],
      [5, Couleur.Radiation],
      [1, Couleur.Joker],
    ];

    let construct = (couleur: Couleur) => {
      return new Generateur(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);

    distrib[0][0] = 4;
    distrib[1][0] = 4;
    distrib[2][0] = 4;
    distrib[3][0] = 4;
    construct = (couleur: Couleur) => {
      return new Virus(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);

    distrib[4][0] = 4; //TODO
    construct = (couleur: Couleur) => {
      return new PareFeu(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);

    distrib[0][0] = 1; //Distraction nucléaire
    distrib[1][0] = 1; //Usurpation d’identité
    distrib[2][0] = 3; //Échange forcé
    distrib[3][0] = 3; //Emprunt à durée indéfinie
    distrib[4][0] = 2; //Nettoyage des systèmes
    construct = (couleur: Couleur) => {
      return new ActionSpe(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);
  }

  // Ajoute une série de carte au deck (Virus, générateur, ...)
  ajouterSerieDeck(
    construct: (couleur: Couleur) => Carte,
    distrib: number[][]
  ) {
    let i: number = 0;
    let j: number = 0;
    for (i = 0; i < 5; i++) {
      for (j = 0; j < distrib[i][0]; j++) {
        this.pioche.push(construct(distrib[i][1]));
      }
    }
  }

  // Ajoute un joueur à la partie
  ajouterJoueur(pseudo: string, espece: Espece) {
    this.joueurs.push(new Joueur(pseudo, espece));
  }
}
