import "./pre-start";
import app from "@server";
import log from "@shared/Logger";
import readline from "readline";
import { exit } from "process";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Output une question et attend un input
function demander(quest: string): Promise<number> {
  return new Promise((res) =>
    rl.question(quest + "\n", (ans) => {
      rl.close();
      res(Number(ans));
    })
  );
}

// Vérifie que le nombre de joueurs est correct
async function demanderNbJoueurs(): Promise<number> {
  let joueursSet: boolean = false;
  let nbJoueurs: number = 0;

  while (!joueursSet) {
    nbJoueurs = await demander("Combien de joueurs participeront ?");

    if (isNaN(nbJoueurs)) console.log("Veuillez entrer un nombre valide !");
    else if (nbJoueurs < 2)
      console.log("Nombre de joueurs trop faible ! (Minimum 2)");
    else if (nbJoueurs > 6)
      console.log("Nombre de joueurs trop grand ! (Maximum 6)");
    else joueursSet = true;
  }
  return nbJoueurs;
}

// Lance la partie en interraction dans la console
async function lancerPartie(): Promise<void> {
  let nbJoueurs: number = await demanderNbJoueurs();
  log.info(nbJoueurs + " participent à la partie");

  //Créer objet partie

  //Tour par tour

  //finir partie
}
//TODO : private/protected si possible
//Création de partie
//"Jouage" d'un tour

// Démarre le server
const port = Number(process.env.PORT || 3000);
let serveur = app.listen(port, async () => {
  log.info("Express server started on port: " + port);
  await lancerPartie();

  serveur.close(() => {
    log.info("Express stopped server");
  });
  exit(0);
});

class Partie {
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
}

const enum Espece {
  Hutex = 1,
  Sonyas,
  Xmars,
  Spectre,
  Ulysse,
  Totox,
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

const enum Couleur {
  Air = 1,
  Eau,
  Energie,
  Radiation,
  Joker,
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
