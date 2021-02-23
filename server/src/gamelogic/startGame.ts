import readline from "readline";
import { Species, Player } from "./Players";
import { Game } from "./Game";
import { GeneratorSlot, State } from "./GeneratorSlot";
import { Color } from "./Card";
import { Action } from "./Action";
import { FirewallCard } from "./FirewallCard";
import { VirusCard } from "./VirusCard";
import { GeneratorCard } from "./GeneratorCard";
import {
  SearchForClean,
  searchVirusToClean,
  supprVirusToClean,
} from "./SearchingVirus";

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
   return the number selected
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
   return the pseudo entered
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
   return the specie selected
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
    console.log(pseudo + " joue les " + Species[species]);
  }
}
/* Display a player's base */
function displayBase(player: Player): void {
  let i = 0;
  let slot: GeneratorSlot;

  console.log("");
  for (slot of player.base) {
    console.log(i + " => " + slot.toString());
    i++;
  }
}

/* Display the players' pseudos */
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

   He can specify any card between 1 and 3 total

   Return an array of the index of the cards
*/
async function askDiscard(player: Player): Promise<number[]> {
  let i: number;

  player.displayHand();

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

/* Ask the player who to target an action to

   Ask between the available players for the specific virus
   return the specified index of the target
*/
async function askTarget(players: Player[], quest: string) {
  let goOn = true;
  let target = 0;

  while (goOn) {
    goOn = false;
    displayPlayers(players);
    target = Number(await ask(quest));
    if (isNaN(target) || target < 0 || target > players.length) {
      console.log("Vous n'avez pas rentré un nombre valide");
      goOn = true;
    }
  }
  return target;
}

/* Ask the player where to do an action

   Ask between the slotbase of a specified player
   return the specified index of the slot's target
*/
async function askSlotTarget(player: Player, quest: string) {
  let goOn = true;
  let slotTarget = 0;

  while (goOn) {
    goOn = false;
    displayBase(player);

    slotTarget = Number(await ask(quest));

    if (isNaN(slotTarget) || slotTarget < 0 || slotTarget > 4) {
      console.log("Vous n'avez pas rentré un nombre valide");
      goOn = true;
    }
  }
  return slotTarget;
}

/* Create an Action using a Firewall card

   Ask which of their generator slot will be targeted
   return an action object
*/
async function createActionFirewall(player: Player, action: Action) {
  const quest = "Sur quel générateur voulez vous utiliser votre parefeu ?";
  const slotTarget = await askSlotTarget(player, quest);

  action.addSlotTarget(slotTarget);
  return action;
}

/* Create an Action using a Virus card

   Ask which players will be targeted
   Ask which of their generator slot will be targeted
   return an action object
*/
async function createActionVirus(players: Player[], action: Action) {
  let quest = "Sur quel joueur voulez vous lancer votre virus ?";
  const target = await askTarget(players, quest);

  quest = "Sur quel générateur voulez vous utiliser votre virus ?";
  const slotTarget = await askSlotTarget(players[target], quest);

  action.addTarget(target);
  action.addSlotTarget(slotTarget);
  return action;
}

/* Ask the player who to give a virus to after cleaning

   Ask between the available players for the specific virus
   return the specified index of the target
*/
async function askWhichToClean(player: Player, viruses: SearchForClean[]) {
  let goOn = true;
  let virusToClean = 0;
  let i: number;

  while (goOn) {
    goOn = false;

    console.log("");
    for (i = 0; i < viruses.length; i++) {
      console.log(i + " => " + player.base[viruses[i].srcSlotInd]);
    }

    virusToClean = Number(await ask("Quel virus faut-il supprimer ?"));

    if (
      isNaN(virusToClean) ||
      virusToClean < 0 ||
      virusToClean > viruses.length
    ) {
      console.log("Vous n'avez pas rentré un nombre valide");
      goOn = true;
    }
  }
  return virusToClean;
}

/* Ask the player where to clean a virus

   Ask between the possible generator of a targeted player
   return the specified index
*/
async function askWhereToClean(indexes: number[], player: Player) {
  let goOn = true;
  let virusToClean = 0;
  let i: number;

  while (goOn) {
    goOn = false;

    console.log("");
    for (i = 0; i < indexes.length; i++) {
      console.log(i + " => " + player.base[indexes[i]]);
    }

    virusToClean = Number(await ask("Quel générateur recevra votre virus ?"));

    if (
      isNaN(virusToClean) ||
      virusToClean < 0 ||
      virusToClean > indexes.length
    ) {
      console.log("Vous n'avez pas rentré un nombre valide");
      goOn = true;
    }
  }
  return virusToClean;
}

/* Create an Action using a Cleaning card

   Search all the possibles viruses available for cleaning
   Let the players decide the order of cleaning
   
   For each virus, ask which player and which generator to target
   return an action object
*/
async function createActionCleaning(
  players: Player[],
  currentPlayer: number,
  action: Action
) {
  let currentSrc: number;
  let currentTarget: number;
  let currentDst: number;
  let quest: string;
  const virusToClean = searchVirusToClean(players, currentPlayer);

  while (virusToClean.length !== 0) {
    currentSrc = await askWhichToClean(players[currentPlayer], virusToClean);

    quest = "Quel joueur aura l'honneur de recycler vos déchêts ?";
    currentTarget = await askTarget(virusToClean[currentSrc].target, quest);

    currentDst = await askWhereToClean(
      virusToClean[currentSrc].dstSlotInd[currentTarget],
      virusToClean[currentSrc].target[currentTarget]
    );

    action.addSlotTarget(currentSrc);
    action.addTarget(currentTarget);
    action.addSlotTarget(currentDst);
    supprVirusToClean(
      virusToClean,
      players[currentTarget],
      currentSrc,
      currentDst
    );
  }
  return action;
}

/* Create an Action using an Exchange card

   Ask which players will be targeted
   Ask which of their generator slot will be targeted
   return an action object
*/
async function createActionExchange(players: Player[], action: Action) {
  let quest = "Qui sera la première victime de l'échange ?";
  const target1 = await askTarget(players, quest);

  quest = "Quel générateur sera pris chez lui ?";
  const slotTarget1 = await askSlotTarget(players[target1], quest);

  quest = "Qui sera la seconde victime de l'échange ?";
  const target2 = await askTarget(players, quest);

  quest = "Quel générateur sera pris chez lui ?";
  const slotTarget2 = await askSlotTarget(players[target2], quest);

  action.addTarget(target1);
  action.addSlotTarget(slotTarget1);
  action.addTarget(target2);
  action.addSlotTarget(slotTarget2);
}

/* Create an Action using a Loan card

   Ask for the player targeted and its generator slot targeted
   return an action object
*/
async function createActionLoan(players: Player[], action: Action) {
  let quest = 'Avec qui voulez vous effectuer un "emprunt" longue durée ?';
  const target1 = await askTarget(players, quest);

  quest = 'Quel générateur voulez vous "emprunter" ?';
  const slotTarget1 = await askSlotTarget(players[target1], quest);

  action.addTarget(target1);
  action.addSlotTarget(slotTarget1);
}

/* Create an Action using a special action card

   Ask the player contextuel informations depending on the card
   return an action object
*/
async function createActionSpe(
  players: Player[],
  currentPlayer: number,
  action: Action
) {
  let quest: string;

  switch (action.card.color) {
    case Color.Water: // Identity theft
      quest = "Avec qui voulez vous échanger d'identité ?";
      action.addTarget(await askTarget(players, quest));
      break;

    case Color.Joker: // System cleaning
      await createActionCleaning(players, currentPlayer, action);
      break;

    case Color.Radiation: // Indefinite term loan
      await createActionLoan(players, action);
      break;

    case Color.Energy: // Forced exchange
      await createActionExchange(players, action);
      break;
  }
  return action;
}

/* Create an object Action representing the action of the player

   return an action object
*/
async function createAction(
  players: Player[],
  currentPlayer: number,
  indexInHand: number
) {
  const player = players[currentPlayer];
  const action = new Action(player.hand[indexInHand], indexInHand);

  if (action.card instanceof GeneratorCard) return action;
  else if (action.card instanceof FirewallCard)
    return await createActionFirewall(player, action);
  else if (action.card instanceof VirusCard)
    return await createActionVirus(players, action);
  else return await createActionSpe(players, currentPlayer, action);
}

/* Ask to the player which card to use

   Return a valid index of a card in the player's hand
*/
async function askCardToUse(player: Player): Promise<number> {
  player.displayHand();

  const indexCard = Number(await ask("Quelle carte voulez-vous poser ?"));
  if (isNaN(indexCard) || indexCard < 0 || indexCard > 2) {
    console.log("Vous n'avez pas rentré un chiffre valide !");
    return askCardToUse(player);
  }
  return indexCard;
}

/* Play a turn

   Display a player's hand and base
   Ask him what action he wants to do
   Realise the action if possible
*/
async function playTurn(game: Game) {
  let indexDiscard: number[];
  let indexCard: number;
  let notDone = true;
  const player = game.currentPlayer;
  let action: Action;

  console.log("\nC'est à vous " + player.pseudo + ", voici vos cartes :");
  player.displayHand();

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
          game.currentPlayerIdx,
          indexCard
        );
        try {
          game.checkAction(action);
          game.playAction(action);
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
        game.resign();
        break;

      default:
        notDone = true;
    }
  }
  game.endTurn();
}

/* Start the game within the terminal 

    Ask the number of players, add them to the game
    Init the game and play turns until the game is finished.
*/
export async function startGame(): Promise<void> {
  const game: Game = new Game();
  const nPlayers: number = await askNumberOfPlayer();

  console.log(nPlayers + " joueurs participent à la partie");
  await addPlayer(game, nPlayers);

  game.init();
  while (game.inProgress) {
    await playTurn(game);
  }
}
