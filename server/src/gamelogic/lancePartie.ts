import readline from "readline";
import log from "@shared/Logger";
import { Espece, Joueur } from "./Joueurs";
import { Partie } from "./Partie";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const regexPseudo = /^[a-zA-Z0-9]{2,32}$/;

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

  if (!regexPseudo.test(pseudo)) {
    console.log("Pseudo incorrect, 2 à 32 caractères alphanumériques !\n");
    return demanderPseudo(n);
  }
  return pseudo;
}

// TODO : Ne pas permettre à un joueur de prendre une espèce déjà prise
// Demande une espèce au joueur
async function demanderEspece(pseudo: string): Promise<number> {
  let espece: string;
  console.log(
    "Les espèces disponibles sont Hutex, Sonyas, Spectre, Totox, Ulysse, Xmars"
  );

  espece = await demander("Espece de " + pseudo + " ?");
  if ("Hutex" === espece) return Espece.Hutex;
  else if ("Sonyas" === espece) return Espece.Sonyas;
  else if ("Spectre" === espece) return Espece.Spectre;
  else if ("Totox" === espece) return Espece.Totox;
  else if ("Ulysse" === espece) return Espece.Ulysse;
  else if ("Xmars" === espece) return Espece.Xmars;

  console.log("Mauvaise espèce sélectionnée !\n");
  return demanderEspece(pseudo);
}

async function ajouterJoueur(partie: Partie, nbJoueurs: number) {
  let i: number;
  let pseudo: string;
  let espece: Espece;

  for (i = 1; i <= nbJoueurs; i++) {
    pseudo = await demanderPseudo(i);
    espece = await demanderEspece(pseudo);
    partie.ajouterJoueur(pseudo, espece);

    console.log(pseudo + " joue les " + especeToString(espece));
    log.info(pseudo + " joue les " + especeToString(espece));
  }
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

// Affiche la main d'un joueur au début de son tour
function afficherMain(joueur: Joueur): void {
  let i: number;

  console.log("\nC'est à vous " + joueur.pseudo + ", voici vos cartes :");
  for (i = 0; i < joueur.main.length; i++) {
    console.log(joueur.main[i].toString());
  }
}

// Demande une action au joueur
async function demanderAction(): Promise<string> {
  let action: string;

  console.log("\nVos actions possibles sont les suivantes :");
  console.log("Défausser\nPoser une carte\nAbandonner");

  action = await demander("Quelle action voulez vous faire ?");
  // TODO : Vérifier que l'action existe
  return action;
}

// Afficher la main du joueur, demande un action, réalise l'action
async function jouerUnTour(partie: Partie) {
  afficherMain(partie.joueurs[partie.joueurEnCours]);
  await demanderAction();
  partie.passer();
}

// Lance la partie en interraction dans la console
export async function lancerPartie(): Promise<void> {
  let partie: Partie;
  let nbJoueurs: number;

  nbJoueurs = await demanderNbJoueurs();
  console.log(nbJoueurs + " joueurs participent à la partie");
  log.info(nbJoueurs + " joueurs participent à la partie");

  partie = new Partie();
  await ajouterJoueur(partie, nbJoueurs);
  partie.init();
  await jouerUnTour(partie);

  await jouerUnTour(partie);
  await jouerUnTour(partie);
  await jouerUnTour(partie);
  //Tour par tour

  //finir partie

  //TODO : private/protected si possible
  //        Fonction disponibles
}
