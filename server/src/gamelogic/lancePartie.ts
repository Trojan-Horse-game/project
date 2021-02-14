import readline from "readline";
import log from "@shared/Logger";
import { Espece } from "./Joueurs";
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

// TODO ? Ne pas permettre à un joueur de prendre une espèce déjà prise
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
export async function lancerPartie(): Promise<void> {
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
  //    Shuffle deck
  //    Distribuer
  //    Premier tour

  //Tour par tour

  //finir partie

  //TODO : private/protected si possible
  // Initialisation de partie
  //"Jouage" d'un tour
}
