import readline from "readline";
import { Espece, Joueur } from "./Joueurs";
import { Partie } from "./Partie";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const regexPseudo = /^[a-zA-Z0-9]{2,32}$/;

/* Ask a question to the player and return his answer */
function demander(quest: string): Promise<string> {
  return new Promise((res) =>
    rl.question(quest + "\n", (ans) => {
      res(ans);
    })
  );
}

/* Ask the number of players

   Ask the number of players until it's between 2 and 6
*/
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

/* Ask a player his pseudo

   Ask the pseudo until it's made of 2 to 32 alphanumerical caracters.
*/
async function demanderPseudo(n: number): Promise<string> {
  let pseudo = await demander("Pseudo du joueur " + n + " ?");

  if (!regexPseudo.test(pseudo)) {
    console.log("Pseudo incorrect, 2 à 32 caractères alphanumériques !\n");
    return demanderPseudo(n);
  }
  return pseudo;
}

/* Ask a player his specie

   Ask the specie until it's one of the proposed
*/
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

/* Add a player to the Game object

   Ask a player his specie and his pseudo then add him to the game
*/
async function ajouterJoueur(partie: Partie, nbJoueurs: number) {
  let i, j: number;
  let pseudo: string;
  let tabVerif = new Array();
  let espece: Espece;

  for (i = 1; i <= nbJoueurs; i++) {
    pseudo = await demanderPseudo(i);
    espece = await demanderEspece(pseudo);
    let condition = false;

    while (!condition) {
      condition = true;
      for (j = 0; j < tabVerif.length; j++) {
        console.log(especeToString(espece));
        console.log("la" + j);
        console.log("ici" + tabVerif[0]);
        if (especeToString(espece) == tabVerif[j]) {
          console.log(
            "Cette espece est deja pris.\n Veuillez Choisir un autre"
          );
          espece = await demanderEspece(pseudo);
          condition = false;
        }
      }
    }

    partie.ajouterJoueur(new Joueur(pseudo, espece));
    tabVerif.push(especeToString(espece));
    console.log(pseudo + " joue les " + especeToString(espece));
  }
}

/* Convert a specie to string */
function especeToString(espece: Espece): string {
  if (espece == Espece.Hutex) return "Hutex";
  else if (espece == Espece.Sonyas) return "Sonyas";
  else if (espece == Espece.Spectre) return "Spectre";
  else if (espece == Espece.Totox) return "Totox";
  else if (espece == Espece.Ulysse) return "Ulysse";
  else if (espece == Espece.Xmars) return "Xmars";
  return "Unkown";
}

/* Display the player's hand at the beginning of its turn */
function afficherMain(joueur: Joueur): void {
  let i: number;

  console.log("\nC'est à vous " + joueur.pseudo + ", voici vos cartes :");
  for (i = 0; i < joueur.main.length; i++) {
    console.log(joueur.main[i].toString());
  }
}

// TODO : Afficher la base du joueur

/* Ask what a player wants to do

   A player can discard card, use a card or abandon the game.
*/
async function demanderAction(): Promise<string> {
  let action: string | undefined;

  console.log(
    "\nVos actions possibles sont les suivantes, Veuillez choisir un numéro :"
  );
  console.log("1 => Défausser\n 2 => Poser une carte\n 3 => Abandonner");
  while (!action) {
    action = await demander("Quelle action voulez vous faire ?");

    switch (action) {
      case "1":
        action = "Defausser";
        break;
      case "2":
        action = "Poser";
        break;
      case "3":
        action = "Abandon";
        break;
      default:
        action = "";
        console.log("Veuillez entrer un chiffre parmi ce qui sont proposés!");

        break;
    }
  }

  return action;
}

/* Play a turn

   Display a player's hand
   Ask him what action he wants to do
   Check if the action is valid
   Realise the action if possible
*/
async function jouerUnTour(partie: Partie) {
  afficherMain(partie.joueurs[partie.joueurEnCours]);
  await demanderAction();
  partie.passer();
}

/* Start the game within the terminal */
export async function lancerPartie(): Promise<void> {
  let partie: Partie;
  let nbJoueurs: number;

  nbJoueurs = await demanderNbJoueurs();
  console.log(nbJoueurs + " joueurs participent à la partie");

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
