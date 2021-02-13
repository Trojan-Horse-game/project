export const enum Espece {
  Hutex = 1,
  Sonyas,
  Xmars,
  Spectre,
  Ulysse,
  Totox,
}

export const enum Couleur {
  Air = 1,
  Eau,
  Energie,
  Radiation,
  Joker,
}

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

    distrib[4][0] = 4;
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

class Joueur {
  pseudo: string;
  espece: Espece;
  main: Carte[] = [];
  base: CaseBase[] = [];

  constructor(pseudo: string, espece: Espece) {
    this.espece = espece;
    this.pseudo = pseudo;
  }
}

class CaseBase {
  etat: number;
  couleur: Couleur;

  constructor(etat: number, couleur: number) {
    this.etat = etat;
    this.couleur = couleur;
  }
}

interface Carte {
  couleur: Couleur;
  action(): void;
}

class Generateur implements Carte {
  couleur: Couleur;

  constructor(couleur: Couleur) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }
}

class Virus implements Carte {
  couleur: Couleur;

  constructor(couleur: Couleur) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }
}

class PareFeu implements Carte {
  couleur: number;

  constructor(couleur: number) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }
}

class ActionSpe implements Carte {
  couleur: number;

  constructor(couleur: number) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }
}
