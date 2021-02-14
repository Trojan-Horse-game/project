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
    let distrib: [number, Couleur][] = [
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
    distrib: [number, Couleur][]
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
  ajouterJoueur(joueur: Joueur) {
    this.joueurs.push(joueur);
  }

  // Initialise le lancement de la partie
  init() {
    this.melangePioche();
    this.distribuer();
  }

  // Mélange en O(n), shuffle Durstenfeld
  melangePioche() {
    for (let i = this.pioche.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.pioche[i], this.pioche[j]] = [this.pioche[j], this.pioche[i]];
    }
  }

  // Fais piocher 3 cartes à tous les joueurs.
  distribuer() {
    let i: number;
    this.joueurEnCours = 0;

    for (i = 0; i < this.joueurs.length; i++) {
      this.piocher(3);
      this.joueurEnCours = (this.joueurEnCours + 1) % this.joueurs.length;
    }
  }

  /* Fais piocher le joueur actuel n cartes
  
    La fonction les enlèves donc de la pioche

    Si la pioche est vide, on inverse la défausse et la pioche
    Normalement la défausse ne peut jamais être vide dans ce cas
  */
  piocher(n: number) {
    let i: number;
    let carte: Carte | undefined;

    for (i = 0; i < n; i++) {
      carte = this.pioche.pop();

      if (carte === undefined) {
        [this.pioche, this.defausse] = [this.defausse, this.pioche];
        carte = this.pioche.pop();
      }

      this.joueurs[this.joueurEnCours].piocher(<Carte>carte);
    }
  }

  passer() {
    this.joueurEnCours = (this.joueurEnCours + 1) % this.joueurs.length;
  }
}
