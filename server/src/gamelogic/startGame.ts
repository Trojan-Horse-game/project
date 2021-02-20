import readline from "readline";
import { Species, Player } from "./Players";
import { Game } from "./Game";
import { BaseSlot } from "./BaseSlot";
import { Color } from "./Card";
import { Action } from "./Action";
import { Firewall } from "./Firewall";
import { Virus } from "./Virus";
import { Generator } from "./Generator";

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

  console.log("");
  for (i = 0; i < player.hand.length; i++) {
    console.log(i + " => " + player.hand[i].toString());
  }
}

/* Display the player's base */
function displayBase(player: Player): void {
  let i = 0;
  let slot: BaseSlot;

  console.log("");
  for (slot of player.base) {
    console.log(i + " => " + slot.toString());
    i++;
  }
}

/* Display the player' pseudos */
function displayPlayers(players: Player[]): void {
  let i: number;

  console.log("");
  for (i = 0; i < players.length; i++) {
    console.log(i + " => " + players[i].pseudo);
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

async function askTarget(players: Player[], quest: string) {
  let goon = true;
  let target = 0;

  while (goon) {
    goon = false;
    displayPlayers(players);
    target = Number(await ask(quest));
    if (isNaN(target) || target < 0 || target > players.length) {
      console.log("Vous n'avez pas rentré un nombre valide");
      goon = true;
    }
  }
  return target;
}

async function askSlotTarget(player: Player, quest: string) {
  let goon = true;
  let slotTarget = 0;

  while (goon) {
    goon = false;
    displayBase(player);

    slotTarget = Number(await ask(quest));

    if (isNaN(slotTarget) || slotTarget < 0 || slotTarget > 4) {
      console.log("Vous n'avez pas rentré un nombre valide");
      goon = true;
    }
  }
  return slotTarget;
}

async function createActionFirewall(player: Player, action: Action) {
  const quest = "Sur quel générateur voulez vous utiliser votre parefeu ?";
  const slotTarget = await askSlotTarget(player, quest);

  action.addSlotTarget(slotTarget);
  return action;
}

async function createActionVirus(players: Player[], action: Action) {
  let quest = "Sur quel joueur voulez vous lancer votre virus ?";
  const target = await askTarget(players, quest);

  quest = "Sur quel générateur voulez vous utiliser votre virus ?";
  const slotTarget = await askSlotTarget(players[target], quest);

  action.addTarget(target);
  action.addSlotTarget(slotTarget);
  return action;
}

async function createActionCleaning(players: Player[], action: Action) {
  /*
  //Créer une liste de virus jetable associé à une liste de joueurs sur qui il est possible de les jeter
  let i: number;
  let j: number;
  let virusToClean: [number, Player[]][] = [];
  for (i = 0; i < players[currentPlayer].base.length; i++) {
    if (players[currentPlayer].base[i].state === State.Virused) {
      // Problème : un virus joker peut se replacer n'importe où
      // Problème : un virus quelconque peut toujours se poser sur un générateur joker sain
    }
  }
  // Tant qu'il y a dse virus jetables, demander un virus à jeter
  // demander la cible correspondante et le générateur sur lequel placé
  // action : n = le nombre de virus jeté (max 5), slotTargetSrc de i à n et targetDst + slotTargetDst de i à n
  */
  const quest = "Sur qui voulez vous rejeter vos virus ?";
  action.addTarget(await askTarget(players, quest));
  return action;
}

async function createActionExchange(players: Player[], action: Action) {
  let quest = "Qui sera la première victime de l'échange ?";
  let target1 = await askTarget(players, quest);

  quest = "Quel générateur sera pris chez lui ?";
  let slotTarget1 = await askSlotTarget(players[target1], quest);

  quest = "Qui sera la seconde victime de l'échange ?";
  let target2 = await askTarget(players, quest);

  quest = "Quel générateur sera pris chez lui ?";
  let slotTarget2 = await askSlotTarget(players[target1], quest);

  action.addTarget(target1);
  action.addSlotTarget(slotTarget1);
  action.addTarget(target2);
  action.addSlotTarget(slotTarget2);
}

async function createActionLoan(players: Player[], action: Action) {
  let quest = 'Avec qui voulez vous effectuer un "emprunt" longue durée ?';
  let target1 = await askTarget(players, quest);

  quest = 'Quel générateur voulez vous "emprunter" ?';
  let slotTarget1 = await askSlotTarget(players[target1], quest);

  action.addTarget(target1);
  action.addSlotTarget(slotTarget1);
}

async function createActionSpe(players: Player[], action: Action) {
  let quest: string;

  switch (action.card.color) {
    case Color.Air: // Nuclear Distract
      break;

    case Color.Water: // Identity theft
      quest = "Avec qui voulez vous échanger d'identité ?";
      action.addTarget(await askTarget(players, quest));
      break;

    case Color.Joker: // System cleaning
      await createActionCleaning(players, action);
      break;

    case Color.Radiation: // Indefinite term loan
      await createActionLoan(players, action);
      break;

    case Color.Energy: // Forced exchange
      await createActionExchange(players, action);
      break;

    default:
      throw "La couleur de la carte n'est pas reconnue !";
  }
  return action;
}

async function createAction(
  players: Player[],
  currentPlayer: number,
  indexInHand: number
) {
  let player = players[currentPlayer];
  let action = new Action(player.hand[indexInHand], indexInHand);

  if (action.card instanceof Generator) return action;
  else if (action.card instanceof Firewall)
    return await createActionFirewall(player, action);
  else if (action.card instanceof Virus)
    return await createActionVirus(players, action);
  else return await createActionSpe(players, action);
}

/* TODO : COMMENTER FONCTIONS

*/
async function askCardToUse(player: Player): Promise<number> {
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
  let notDone = true;
  const player = game.players[game.currentPlayer];
  let action: Action;

  console.log("\nC'est à vous " + player.pseudo + ", voici vos cartes :");
  displayHand(player);

  console.log("Voici votre base :");
  displayBase(player);

  while (notDone) {
    const answer = await askAction();

    notDone = false;
    switch (answer) {
      case "Poser":
        indexCard = await askCardToUse(player);
        action = await createAction(
          game.players,
          game.currentPlayer,
          indexCard
        );
        try {
          game.checkAction(action);
          console.log(action);
        } catch (err) {
          console.log(err);
          notDone = true;
        }
        break;

      case "Defausser":
        indexDiscard = await askDiscard(player);
        game.discardHand(indexDiscard);
        break;

      case "Abandon":
        game.abandon();
        break;

      default:
        notDone = true;
    }
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
  //        Changer Distraction nucléaire
  //        Commenter tout
  //        Faire des test
  //        Faire l'action dans le backend et l'envoyer
}
