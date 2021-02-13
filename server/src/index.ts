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
  /* constructor() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        this.pioche.push(new Generateur(1))
      }
    }
  } */
}

enum Espece {
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
  couleur: number;

  constructor(etat: number, couleur: number) {
    this.etat = etat;
    this.couleur = couleur;
  }
}

enum Espece {
  Eau = 1,
  Energie,
  Radiation,
  Air,
  Joker,
}

interface Carte {
  couleur: number;
  action(): void;
}

class Generateur implements Carte {
  couleur: number;

  constructor(couleur: number) {
    this.couleur = couleur;
  }

  action(): void {
    //TODO
  }
}

class Virus implements Carte {
  couleur: number;

  constructor(couleur: number) {
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
