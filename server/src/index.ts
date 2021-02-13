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
function demander(quest: string): Promise<string> {
  return new Promise((res) =>
    rl.question(quest + "\n", (ans) => {
      res(ans);
    })
  );
}

// Vérifie que le nombre de joueurs est correct
async function demanderNbJoueurs(): Promise<number> {
  let joueursSet: boolean = false;
  let nbJoueurs: number = 0;

  while (!joueursSet) {
    nbJoueurs = Number(await demander("Combien de joueurs participeront ?"));

    if (isNaN(nbJoueurs)) console.log("Veuillez entrer un nombre valide !");
    else if (nbJoueurs < 2)
      console.log("Nombre de joueurs trop faible ! (Minimum 2)");
    else if (nbJoueurs > 6)
      console.log("Nombre de joueurs trop grand ! (Maximum 6)");
    else joueursSet = true;
  }
  return nbJoueurs;
}

// TODO : décider d'une longueur de pseudo max
// Demande le pseudo du joueur
async function demanderPseudo(n: number): Promise<string> {
  let pseudo = await demander("Pseudo du joueur " + n + " ?");

  if (pseudo.length > 32) {
    console.log("Pseudo trop long !\n");
    return demanderPseudo(n);
  }
  return pseudo;
}

// TODO ? Ne pas permettre à un joueur de prendre une espèce déjà prise
// Demande une espèce au joueur
async function demanderEspece(pseudo: string): Promise<number> {
  let espece: string;
  console.log(
    "Les espèces disponibles sont Hutex, Sonyas, Spectre, Totox, Ulysse, Xmars"
  );

  espece = await demander("Espece de " + pseudo + " ?");
  if ("Hutex".match(espece)) return Espece.Hutex;
  else if ("Sonyas".match(espece)) return Espece.Sonyas;
  else if ("Spectre".match(espece)) return Espece.Spectre;
  else if ("Totox".match(espece)) return Espece.Totox;
  else if ("Ulysse".match(espece)) return Espece.Ulysse;
  else if ("Xmars".match(espece)) return Espece.Xmars;

  console.log("Mauvaise espèce sélectionnée !\n");
  return demanderEspece(pseudo);
}

// Convertit l'enum Espece en string correspondant
function especeToString(espece: Espece): string {
  if (espece == Espece.Hutex) return "Hutex";
  else if (espece == Espece.Sonyas) return "Sonyas";
  else if (espece == Espece.Spectre) return "Spectre";
  else if (espece == Espece.Totox) return "Totox";
  else if (espece == Espece.Ulysse) return "Ulysse";
  else if (espece == Espece.Xmars) return "Xmars";
  return "Unkown";
}

// Lance la partie en interraction dans la console
async function lancerPartie(): Promise<void> {
  let partie: Partie;
  let i: number = 0;
  let pseudo: string;
  let espece: Espece;
  let nbJoueurs: number = await demanderNbJoueurs();

  console.log(nbJoueurs + " joueurs participent à la partie");
  log.info(nbJoueurs + " joueurs participent à la partie");

  partie = new Partie();
  for (i = 1; i <= nbJoueurs; i++) {
    pseudo = await demanderPseudo(i);
    espece = await demanderEspece(pseudo);
    partie.ajouterJoueur(pseudo, espece);

    console.log(pseudo + " joue les " + especeToString(espece));
    log.info(pseudo + " joue les " + especeToString(espece));
  }
  // Ajouter joueurs tour à tour
  // Init partie

  //Tour par tour

  //finir partie

  //TODO : private/protected si possible
  // Initialisation de partie
  //"Jouage" d'un tour
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

const enum Espece {
  Hutex = 1,
  Sonyas,
  Xmars,
  Spectre,
  Ulysse,
  Totox,
}

const enum Couleur {
  Air = 1,
  Eau,
  Energie,
  Radiation,
  Joker,
}

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
