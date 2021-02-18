import readline from "readline";
import { Species, Player } from "./Players";
import { Game } from "./Game";
import { State } from "./BaseSlot";
import { Card, Color } from "./Card";
import { Action } from "./Action";
import { Firewall } from "./Firewall";
import { Virus } from "./Virus";
import { Generator } from "./Generator";
import { parse } from "dotenv/types";
import { throws } from "assert";

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
  const nPlayers = Number(await ask("\nCombien de joueurs participeront ?"));

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
  const pseudo = await ask("\nPseudo du joueur " + n + " ?");

  if (!regexPseudo.test(pseudo)) {
    console.log("Pseudo incorrect, 2 à 32 caractères alphanumériques !");
    return askPseudo(n);
  }
  return pseudo;
}

/* Ask a player his species and returns it

   Ask the species until it's one of the proposed
*/
async function askSpecies(
  pseudo: string,
  available: Species[]
): Promise<number> {
  let i: number;

  console.log("\nLes espèces disponibles sont :");
  for (i = 0; i < available.length; i++) {
    console.log(i + " => " + Species[available[i]]);
  }

  const species = Number(await ask("Espece de " + pseudo + " ?"));

  for (i = 0; i < available.length; i++) {
    if (!isNaN(species) && species < available.length && species >= 0)
      return available[species];
  }

  console.log("Mauvaise espèce sélectionnée !\n");
  return askSpecies(pseudo, available);
}

/* Add a player to the Game object

   Ask a player his species and his pseudo then add him to the game
*/
async function addPlayer(game: Game, nPlayers: number) {
  let i: number;
  let pseudo: string;
  let species: Species;

  for (i = 1; i <= nPlayers; i++) {
    pseudo = await askPseudo(i);
    species = await askSpecies(pseudo, game.availableSpecies);

    game.addPlayer(new Player(pseudo, species));
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

  for (i = 0; i < player.hand.length; i++) {
    console.log(i + " => " + player.hand[i].toString());
  }
}

/* Display the player's base */
function displayBase(player: Player): void {
  let i: number;

  for (i = 0; i < player.base.length; i++) {
    if (player.base[i].state != State.Empty)
      console.log(player.base[i].toString());
  }
}

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
      console.log("Veuillez entrer un chiffre parmi ceux qui sont proposés!");
      return askAction();
  }
  return action;
}

/* Ask the player the cards he wants to discard

   Return an array of the index of the cards
*/
async function askDiscard(player: Player): Promise<number[]> {
  let i: number;

  console.log("");

  displayHand(player);

  const answer = await ask(
    "Veuillez choisir les cartes à défausser en les séparant par une virgule :"
  );

  const indexDiscard = answer.split(",").map(Number);
  for (i of indexDiscard) {
    if (isNaN(i) || i < 0 || i > 2) {
      console.log(
        "Vous n'avez pas rentré que des chiffres valides, exemple : 0, 1, 2"
      );
      return askDiscard(player);
    }
  }
  return indexDiscard;
}

function generatorContext(
  players: Player[],
  currentPlayer: number,
  action: Action
): Action {
  const temp = players[currentPlayer].getBase(action.card.color);
  if (players[currentPlayer].base[temp].state !== State.Empty) {
    throw "The generator is already placed in your base !";
  }
  return action;
}

async function firewallContext(
  players: Player[],
  currentPlayer: number,
  action: Action
): Promise<Action> {
  let slotTarget = 0;
  let goon = true;

  if (action.card.color === Color.Joker) {
    goon = true;
    while (goon) {
      goon = false;
      displayBase(players[currentPlayer]);
      slotTarget = Number(
        await ask(
          "Sur quel générateur voulez vous utiliser votre parefeu joker ?"
        )
      );
      if (isNaN(slotTarget) || slotTarget < 0 || slotTarget > 4) {
        console.log("Vous n'avez pas rentré un nombre valide");
        goon = true;
      }
    }
  } else {
    slotTarget = players[currentPlayer].getBase(action.card.color);
  }

  const temp = players[currentPlayer].base[slotTarget].state;
  if (temp === State.Empty) {
    throw "Vous ne pouvez pas utiliser un parefeu sur un générateur absent !";
  } else if (temp === State.Immunized) {
    throw "Vous ne pouvez pas utiliser un parefeu sur un générateur immunisé !";
  } else {
    action.addBaseSlot1(slotTarget);
  }
  return action;
}

async function virusContext(
  players: Player[],
  action: Action
): Promise<Action> {
  let slotTarget = 0;
  let goon = true;
  let target = 0;

  while (goon) {
    goon = false;
    target = Number(
      await ask("Sur quel joueur voulez vous lancer votre virus ?")
    );
    if (isNaN(target) || target < 0 || target > players.length) {
      console.log("Vous n'avez pas rentré un nombre valide");
      goon = true;
    }
  }

  if (action.card.color === Color.Joker) {
    goon = true;
    while (goon) {
      goon = false;
      displayBase(players[target]);
      slotTarget = Number(
        await ask(
          "Sur quel générateur voulez vous utiliser votre virus joker ?"
        )
      );
      if (isNaN(slotTarget) || slotTarget < 0 || slotTarget > 4) {
        console.log("Vous n'avez pas rentré un nombre valide");
        goon = true;
      }
    }
  } else {
    slotTarget = players[target].getBase(action.card.color);
  }

  const temp = players[target].base[slotTarget].state;
  if (temp === State.Empty) {
    throw "Vous ne pouvez pas utiliser un virus sur un générateur absent !";
  } else if (temp === State.Immunized) {
    throw "Vous ne pouvez pas utiliser un virus sur un générateur immunisé !";
  } else {
    action.addTarget1(target);
    action.addBaseSlot1(slotTarget);
  }
  return action;
}

/* async function actionSpeContext(
  players: Player[],
  currentPlayer: number,
  action: Action
): Promise<Action> {
}
*/

async function parseAction(
  players: Player[],
  currentPlayer: number,
  indexInHand: number
): Promise<Action> {
  const action = new Action(
    players[currentPlayer].hand[indexInHand],
    indexInHand
  );

  if (action.card instanceof Generator) {
    return generatorContext(players, currentPlayer, action);
  } else if (action.card instanceof Firewall) {
    return await firewallContext(players, currentPlayer, action);
  } else if (action.card instanceof Virus) {
    return await virusContext(players, action);
  } else {
    //return await actionSpeContext(players, currentPlayer, action);
  }
  return action;
}

/* TODO : COMMENTER FONCTIONS

*/
async function askCardToUse(player: Player): Promise<number> {
  console.log("");

  displayHand(player);

  const indexCard = Number(await ask("Quelle carte voulez-vous poser ?"));
  if (isNaN(indexCard) || indexCard < 0 || indexCard > 2) {
    console.log("Vous n'avez pas rentré un chiffre valide !");
    return askCardToUse(player);
  }
  return indexCard;
}

/* Play a turn

   Display a player's hand
   Ask him what action he wants to do
   Realise the action if possible
*/
async function playTurn(game: Game) {
  let indexDiscard: number[];
  let indexCard: number;
  const player = game.players[game.currentPlayer];

  console.log("\nC'est à vous " + player.pseudo + ", voici vos cartes :");
  displayHand(player);

  console.log("Voici votre base :");
  displayBase(player);

  const action = await askAction();

  switch (action) {
    case "Poser":
      indexCard = await askCardToUse(player);
      try {
        parseAction(game.players, game.currentPlayer, indexCard);
      } catch (err) {
        console.log(err); // Redemander action
      }
      // Organe uniquement devant joueur

      // Virus sur générateur ennemi ou allié
      // Pour le joker il faut demander la couleur en plus

      // Parefeu pareil

      // Action Spe
      // Transplantation = echange baseslot = le plus chiant

      // if ActionSpe, demande contextuel
      // If joker demande contextuel
      // Sinon, demande sur quel joueur
      break;
    case "Defausser":
      indexDiscard = await askDiscard(player);
      game.discardHand(indexDiscard);
      break;
    case "Abandon":
      game.abandon();
      break;
  }
  game.endTurn();
}

/* Start the game within the terminal */
export async function startGame(): Promise<void> {
  const game: Game = new Game();
  const nPlayers: number = await askNumberOfPlayer();

  console.log(nPlayers + " joueurs participent à la partie");
  await addPlayer(game, nPlayers);

  game.init();
  while (game.inProgress) {
    await playTurn(game);
  }

  //TODO : private/protected si possible
  //        Fonction disponibles
}
