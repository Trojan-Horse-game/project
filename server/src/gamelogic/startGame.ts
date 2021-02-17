import readline from "readline";
import { Species, Player } from "./Players";
import { Game } from "./Game";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const regexPseudo = /^[a-zA-Z0-9]{2,32}$/;

/* Ask a question to the player and return his answer */
function ask(quest: string): Promise<string> {
  return new Promise((res) =>
    rl.question(quest + "\n", (ans) => {
      res(ans);
    })
  );
}

/* Ask the number of players and returns it

   Ask the number of players until it's between 2 and 6
*/
async function askNumberOfPlayer(): Promise<number> {
  let nPlayers: number;
  nPlayers = Number(await ask("\nCombien de joueurs participeront ?"));

  if (isNaN(nPlayers)) {
    console.log("Veuillez entrer un nombre valide !");
    return askNumberOfPlayer();
  } else if (nPlayers < 2) {
    console.log("Nombre de joueurs trop faible ! (Minimum 2)");
    return askNumberOfPlayer();
  } else if (nPlayers > 6) {
    console.log("Nombre de joueurs trop grand ! (Maximum 6)");
    return askNumberOfPlayer();
  } else {
    return nPlayers;
  }
}

/* Ask a player his pseudo and returns it

   Ask the pseudo until it's made of 2 to 32 alphanumerical caracters.
*/
async function askPseudo(n: number): Promise<string> {
  let pseudo = await ask("\nPseudo du joueur " + n + " ?");

  if (!regexPseudo.test(pseudo)) {
    console.log("Pseudo incorrect, 2 à 32 caractères alphanumériques !");
    return askPseudo(n);
  }
  return pseudo;
}

/* Ask a player his species and returns it

   Ask the species until it's one of the proposed
*/
async function askSpecies(pseudo: string): Promise<number> {
  let species: string;
  console.log(
    "\nLes espèces disponibles sont Hutex, Sonyas, Spectre, Totox, Ulysse, Xmars"
  ); // TODO : Only print available species

  species = await ask("Espece de " + pseudo + " ?");

  if ("Hutex" === species) return Species.Hutex;
  else if ("Sonyas" === species) return Species.Sonyas;
  else if ("Spectre" === species) return Species.Spectre;
  else if ("Totox" === species) return Species.Totox;
  else if ("Ulysse" === species) return Species.Ulysse;
  else if ("Xmars" === species) return Species.Xmars;

  console.log("Mauvaise espèce sélectionnée !\n");
  return askSpecies(pseudo);
}

/* Add a player to the Game object

   Ask a player his specie and his pseudo then add him to the game
*/
async function addPlayer(game: Game, nPlayers: number) {
  let i: number;
  let j: number;
  let condition;
  let pseudo: string;
  let tabVerif = new Array(); // TODO we should use a property of Game instead
  let species: Species;

  for (i = 1; i <= nPlayers; i++) {
    pseudo = await askPseudo(i);
    species = await askSpecies(pseudo);
    condition = false;

    // TODO we should put that in the function askSpecies
    while (!condition) {
      condition = true;
      for (j = 0; j < tabVerif.length; j++) {
        if (speciesToString(species) == tabVerif[j]) {
          console.log(
            "Cette espece est deja prise.\nVeuillez en choisir une autre"
          );
          species = await askSpecies(pseudo);
          condition = false;
        }
      }
    }

    game.addPlayer(new Player(pseudo, species));
    tabVerif.push(speciesToString(species));
    console.log(pseudo + " joue les " + speciesToString(species));
  }
}

/* Convert a specie to string */
function speciesToString(species: Species): string {
  if (species == Species.Hutex) return "Hutex";
  else if (species == Species.Sonyas) return "Sonyas";
  else if (species == Species.Spectre) return "Spectre";
  else if (species == Species.Totox) return "Totox";
  else if (species == Species.Ulysse) return "Ulysse";
  else if (species == Species.Xmars) return "Xmars";
  return "Unkown";
}

/* Display the player's hand at the beginning of its turn */
function displayHand(player: Player): void {
  let i: number;

  console.log("\nC'est à vous " + player.pseudo + ", voici vos cartes :");
  for (i = 0; i < player.main.length; i++) {
    console.log(player.main[i].toString());
  }
}

// TODO : diplay player's base

/* Ask what a player wants to do

   A player can discard card, use a card or abandon the game.
*/
async function askAction(): Promise<string> {
  let action: string | undefined;
  console.log(
    "\nVos actions possibles sont les suivantes, Veuillez choisir un numéro :"
  );
  console.log("1 => Défausser\n2 => Poser une carte\n3 => Abandonner");
  action = await ask("Quelle action voulez vous faire ?");

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
      console.log("Veuillez entrer un chiffre parmi ce qui sont proposés!");
      return askAction();
  }
  return action;
}

// TODO : put this in Game method
function abandon(game: Game) {
  console.log(
    "Le joueur:" +
      game.players[game.currentPlayer].pseudo +
      " nous as malheureusement quitté"
  );
  game.players.splice(game.currentPlayer, 1);
  if (game.players.length == 1) {
    game.inProgress = false;
    console.log(
      "Felecitation " +
        game.players[game.currentPlayer].pseudo +
        " ! Vous avez remporté la partie! "
    );
    return;
  }
}

/* Play a turn

   Display a player's hand
   Ask him what action he wants to do
   Check if the action is valid
   Realise the action if possible
*/
async function playTurn(game: Game) {
  let action: string;

  displayHand(game.players[game.currentPlayer]);
  action = await askAction();
  switch (action) {
    case "Poser":
      break;
    case "Defausser":
      break;
    case "Abandon":
      abandon(game);
      break;
    default:
      game.pass;
  }
}

/* Start the game within the terminal */
export async function startGame(): Promise<void> {
  let game: Game = new Game();
  let nPlayers: number = await askNumberOfPlayer();

  console.log(nPlayers + " joueurs participent à la partie");
  await addPlayer(game, nPlayers);

  game.init();
  while (game.inProgress) {
    await playTurn(game);
  }

  //end game

  //TODO : private/protected si possible
  //        Fonction disponibles
}
