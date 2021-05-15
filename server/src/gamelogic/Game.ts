import { SpecialCard } from "./SpecialCard";
import { Card, Color } from "./Card";
import { GeneratorCard } from "./GeneratorCard";
import { Player, Species } from "./Players";
import { FirewallCard } from "./FirewallCard";
import { VirusCard } from "./VirusCard";
import { Action } from "./Action";
import { GeneratorSlot, State } from "./GeneratorSlot";
import { searchVirusToClean, supprVirusToClean } from "./SearchingVirus";

/* A class representing a game */
export class Game {
  players: Player[] = [];
  winnerIdx: number = 0;
  deck: Card[] = [];
  roomId: string;
  currentPlayerIdx = 0;


  inProgress = false;
  availableSpecies: Species[];

  constructor(id?: string) {
    this.roomId = id || "";
    this.availableSpecies = [
      Species.Hutex,
      Species.Robotec,
      Species.Spectre,
      Species.Totox,
      Species.Fawkes,
      Species.Xmars,
    ];
    this.createDeck();
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerIdx];
  }

  /* Create the deck by adding the cards
  
     Use addSerieToDeck to add Generators, Virus, Firewall,
     ActionSpe card's to the deck

     To add these series of cards, we follow their distribution
  */
  createDeck() {
    let construct = (color: Color) => {
      return new GeneratorCard(color);
    };

    this.addSerieToDeck(construct, 5, Color.Air);
    this.addSerieToDeck(construct, 5, Color.Water);
    this.addSerieToDeck(construct, 5, Color.Energy);
    this.addSerieToDeck(construct, 5, Color.Radiation);
    this.addSerieToDeck(construct, 1, Color.Joker);

    construct = (color: Color) => {
      return new VirusCard(color);
    };

    this.addSerieToDeck(construct, 4, Color.Air);
    this.addSerieToDeck(construct, 4, Color.Water);
    this.addSerieToDeck(construct, 4, Color.Energy);
    this.addSerieToDeck(construct, 4, Color.Radiation);
    this.addSerieToDeck(construct, 1, Color.Joker);

    construct = (color: Color) => {
      return new FirewallCard(color);
    };

    this.addSerieToDeck(construct, 4, Color.Air);
    this.addSerieToDeck(construct, 4, Color.Water);
    this.addSerieToDeck(construct, 4, Color.Energy);
    this.addSerieToDeck(construct, 4, Color.Radiation);
    this.addSerieToDeck(construct, 4, Color.Joker);

    construct = (color: Color) => {
      return new SpecialCard(color);
    };

    this.addSerieToDeck(construct, 1, Color.Air); // Nuclear Distract
    this.addSerieToDeck(construct, 1, Color.Water); // Identity theft
    this.addSerieToDeck(construct, 3, Color.Energy); // Forced exchange
    this.addSerieToDeck(construct, 3, Color.Radiation); // Indefinite term loan
    this.addSerieToDeck(construct, 2, Color.Joker); // System cleaning
  }

  /* Add a type of cards to the deck

     Use the constructor of a card object to push it to the deck
     Push n card of the same type
  */
  addSerieToDeck(construct: (color: Color) => Card, n: number, color: Color) {
    let i = 0;

    for (i; i < n; i++) {
      this.deck.push(construct(color));
    }
  }

  /* Add a player to the game 
  
     The player must have a valid specie selected
     The game must have less than 6 players already
  */
  addPlayer(player: Player) {
    const x = this.availableSpecies.indexOf(player.species);
    if (this.players.length <= 6 && x != -1) {
      this.availableSpecies.splice(x, 1);
      this.players.push(player);
    } else {
      throw "Espèce invalide";
    }
  }

  /* Initialize the game

     Shuffle the deck and distribute cards to the players
  */
  init() {
    if (this.players.length >= 2 && this.players.length <= 6) {
      this.shuffleDeck();
      this.distribute();
      this.inProgress = true;
      this.currentPlayerIdx = Math.floor(Math.random() * this.players.length);
    } else {
      throw "You are not 2 to 6 players";
    }
  }

  /* Shuffle the deck
  
     Complexity of O(n), shuffle Durstenfeld
  */
  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  /* Distribute 3 cards to all players */
  distribute() {
    let i: number;
    this.currentPlayerIdx = 0;

    for (i = 0; i < this.players.length; i++) {
      this.draw(3);
      this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
    }
  }

  /* Make a player draw n cards
  
    Delete the cards from the deck after drawing them
    The deck should never be empty but we check anyway
  */
  draw(n: number) {
    let i: number;
    let card: Card | undefined;

    for (i = 0; i < n; i++) {
      card = this.deck.pop();
      if (card === undefined) {
        throw "Empty deck";
      }
      this.currentPlayer.draw(card);
    }
  }



  /* End the player's turn 
  
     Make the player draw a valid number of cards
  */
  endTurn() {
    const handLength = this.currentPlayer.hand.length;
    if (handLength != 3) {
      this.draw(3 - handLength);
    }

    this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
  }

  /* Check if someone won

     Return undefined if no one has
     Return the winner's index if someone has
  */
  checkForWinner() {
    let winner: Player;
    let ind = 0;
    for (winner of this.players) {
      if (winner.checkWin()) return ind;
      ind++;
    }
    return undefined;
  }

  /* End the game */
  endGame(winnerIndx: number) {
    this.inProgress = false;
    this.winnerIdx = winnerIndx;
  }

  /* Check if the discard's indexes are valid */
  checkDiscard(indexDiscard: number[]) {
    let i: number;

    for (i of indexDiscard) {
      if (isNaN(i) || i < 0 || i > 2) {
        throw "Discard : mauvaise index de discard";
      }
    }
  }

  /* Discard cards from the hand of the current player(default)

     Put it back at the bottom of the deck
  */
  discardHand(indices: number[], player = this.currentPlayer) {
    let i: number;
    let padd = 0;
    for (i of indices) {
      this.deck.unshift(player.discardHand(i - padd));
      padd++;
    }
  }

  /* Discard cards from slots of the current player(default)

     Put them back at the bottom of the deck
  */
  discardBase(index: number[], player = this.currentPlayer) {
    let i: number;
    let oldCard: Card;

    for (i of index) {
      const toDiscard = player.discardBase(i);
      for (oldCard of toDiscard) {
        this.deck.unshift(oldCard);
      }
    }
  }

  /* Make the current player abandon the game
  
     Discard its hand and its base
  */
  resign(index = this.currentPlayerIdx) {
    this.discardHand([0, 1, 2], this.players[index]);
    this.discardBase([0, 1, 2, 3, 4]);

    this.players.splice(index, 1);

    if (index < this.currentPlayerIdx) {
      this.currentPlayerIdx--;
    }
    this.currentPlayerIdx %= this.players.length;

    if (this.players.length == 1) {
      this.endGame(0);
    }
  }

  /* Check if an action is valid and realize it 
  
     Check if the action finish the game and finish the game if it does
  */
  playAction(action: Action) {
    this.checkAction(action);
    action.card.action(this, action);
    const winnerIdx = this.checkForWinner();
    if (winnerIdx !== undefined) {
      this.endGame(winnerIdx);
    }
    this.endTurn();
  }

  /* Check if an action is valid

     Throw an error if it's not, return the action if it is
  */
  checkAction(action: Action) {
    if (action.card instanceof GeneratorCard) this.checkActionGenerator(action);
    else if (action.card instanceof FirewallCard)
      this.checkActionFirewall(action);
    else if (action.card instanceof VirusCard) this.checkActionVirus(action);
    else this.checkActionSpe(action);
  }

  /* Check if a special action is valid

    Check that the card specified in the action is held by the player

    We don't need to check anything else for nuclear distract
    We only check if the action is properly set for Id theft

     Throw an error if it's not valid, return the action if it is
  */
  checkActionSpe(action: Action) {
    const cardInHand = this.currentPlayer.hand[action.indexInHand];
    if (!(cardInHand instanceof SpecialCard)) {
      throw "Action : pas d'action en main à l'index";
    }

    if (cardInHand.color !== action.card.color) {
      throw "Action : mauvaise action en main";
    }

    switch (action.card.color) {
      case Color.Water: // Identity theft
        if (action.target[0] === undefined)
          throw "Action id theft : pas de joueur cible";
        break;

      case Color.Joker: // System cleaning
        this.checkActionCleaning(action);
        break;

      case Color.Radiation: // Indefinite term loan
        this.checkActionLoan(action);
        break;

      case Color.Energy: // Forced exchange
        this.checkActionExchange(action);
        break;
    }
  }

  /* Check if a system cleaning action is valid

     Check for every virus cleaned that :
      - The receiver of the "cleaned" virus is not the current player
      - The slot target are properly set
      - The state of both generator are proper (Virused and Generator only)
      - The type of virus sent and the type of the receiver are coherent
    
    Check for the whole action that :
      - Every candidates for cleaning are being cleaned

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionCleaning(action: Action) {
    let i: number;
    let dst: GeneratorSlot;
    let src: GeneratorSlot;
    const candidates = searchVirusToClean(this.players, this.currentPlayerIdx);

    for (i = 0; i < action.target.length; i++) {
      if (action.target[i] === undefined) {
        throw "Action cleaning : pas de joueur cible";
      }
      if (action.target[i] === this.currentPlayerIdx)
        throw "Action cleaning : mauvais joueur cible";

      if (action.slotTarget[2 * i] === undefined) {
        throw "Action cleaning : pas de générateur source";
      }

      if (action.slotTarget[2 * i + 1] === undefined) {
        throw "Action cleaning : pas de générateur cible";
      }

      dst = this.players[action.target[i]].base[action.slotTarget[2 * i + 1]];
      src = this.currentPlayer.base[action.slotTarget[2 * i]];
      if (src.state !== State.Virused)
        throw "Action cleaning : Générateur source non infecté";

      if (dst.state !== State.Generator)
        throw "Action cleaning : Générateur cible non sain";

      if (
        src.cards[1].color !== Color.Joker &&
        dst.color !== Color.Joker &&
        src.cards[1].color !== dst.color
      ) {
        throw "Action cleaning : Générateur cible incompatible";
      }

      supprVirusToClean(
        candidates,
        this.players[action.target[0]],
        action.slotTarget[0],
        action.slotTarget[1]
      );
    }

    if (candidates.length !== 0)
      throw "Action cleaning : il reste du ménage à faire";
  }

  /* Check if a forced exchange action is valid

     Check that :
      - Both targets and both slots are specified
      - No immunized or empty generator are part of the exchange
      - No double of an already existing generator are created after the exchange

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionExchange(action: Action) {
    let baseIdx: number;
    let firstDst: GeneratorSlot;
    let secondDst: GeneratorSlot;

    if (action.target[0] === undefined)
      throw "Action exchange : pas de joueur cible";
    if (action.slotTarget[0] === undefined)
      throw "Action exchange : pas de générateur cible";
    if (action.target[1] === undefined)
      throw "Action exchange : pas de second joueur cible";
    if (action.slotTarget[1] === undefined)
      throw "Action exchange : pas de second générateur cible";

    const firstSrc = this.players[action.target[0]].base[action.slotTarget[0]];
    if (firstSrc.state === State.Immunized)
      throw "Action exchange : générateur cible immunisé";

    if (firstSrc.state === State.Empty)
      throw "Action exchange : générateur cible inexistant";

    const secondSrc = this.players[action.target[1]].base[action.slotTarget[1]];
    if (secondSrc.state === State.Immunized)
      throw "Action exchange : générateur cible immunisé";
    if (secondSrc.state === State.Empty)
      throw "Action exchange : générateur cible inexistant";

    if (firstSrc.color !== secondSrc.color) {
      baseIdx = this.players[action.target[1]].getBase(firstSrc.color);
      firstDst = this.players[action.target[1]].base[baseIdx];

      baseIdx = this.players[action.target[0]].getBase(secondSrc.color);
      secondDst = this.players[action.target[0]].base[baseIdx];

      if (firstDst.state !== State.Empty)
        throw "Action exchange : échange créant un doublon";
      if (secondDst.state !== State.Empty)
        throw "Action exchange : échange créant un doublon";
    }
  }

  /* Check if a loan action is valid

     Check that :
      - Both the target and the slot are specified
      - No immunized or empty generator are part of the loan
      - No double of an already existing generator are created after the loan

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionLoan(action: Action) {
    if (action.target[0] === undefined)
      throw "ActionLoan : pas de joueur cible";

    if (action.slotTarget[0] === undefined)
      throw "ActionLoan : pas de générateur cible";

    const loanSrc = this.players[action.target[0]].base[action.slotTarget[0]];
    if (loanSrc.state === State.Immunized)
      throw "ActionLoan : générateur cible immunisé !";

    if (loanSrc.state === State.Empty)
      throw "ActionLoan : générateur cible inexistant !";

    const loanDst = this.currentPlayer.base[action.slotTarget[0]];
    if (loanDst.state !== State.Empty)
      throw "ActionLoan : générateur cible déjà posséder";
  }

  /* Check if a Virus action is valid

     Check that :
      - The action is correctly specified
      - Both the target and the slot are specified
      - No immunized or empty generator are part of the action
      - The color of the virus checks with the targeted generator
      
    The color checks if :
      - The virus is a joker
      - The generator is a joker
      - The virus attacks a joker firewall
      - The virus is of the same type of the generator's one

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionVirus(action: Action) {
    const cardInHand = this.currentPlayer.hand[action.indexInHand];
    if (!(cardInHand instanceof VirusCard)) {
      throw "Virus : pas de virus en main à l'index";
    }

    if (cardInHand.color !== action.card.color) {
      throw "Virus : virus de la mauvaise couleur";
    }

    if (action.target[0] === undefined) throw "Virus : pas de joueur cible";

    if (action.slotTarget[0] === undefined)
      throw "Virus : pas de générateur cible";

    const temp = this.players[action.target[0]].base[action.slotTarget[0]];
    if (temp.state === State.Empty) throw "Virus : générateur cible inexistant";

    if (temp.state === State.Immunized)
      throw "Virus : générateur cible immunisé";

    if (action.card.color === Color.Joker) return;

    if (temp.color === Color.Joker) return;

    if (temp.state === State.Protected && temp.cards[1].color === Color.Joker)
      return;

    if (temp.color !== action.card.color)
      throw "Virus : générateur cible de couleur incompatible";
    return;
  }

  /* Check if a Firewall action is valid

     Check that :
      - The action is correctly specified
      - The slot is specified
      - No immunized or empty generator are part of the action
      - The color of the firewall checks with the targeted generator
      
    The color checks if :
      - The firewall is a joker
      - The generator is a joker
      - The firewall target a joker virus
      - The firewall is of the same type of the generator's one

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionFirewall(action: Action) {
    const cardInHand = this.currentPlayer.hand[action.indexInHand];
    if (!(cardInHand instanceof FirewallCard)) {
      throw "Firewall : pas de pare-feu en main à l'index";
    }

    if (cardInHand.color !== action.card.color) {
      throw "Firewall : pare-feu de la mauvaise couleur";
    }

    if (action.slotTarget[0] === undefined)
      throw "Firewall : pas de générateur cible";

    const temp = this.currentPlayer.base[action.slotTarget[0]];
    if (temp.state === State.Empty)
      throw "Firewall : générateur cible inexistant";

    if (temp.state === State.Immunized)
      throw "Firewall : générateur cible immunisé";

    if (action.card.color === Color.Joker) return;

    if (temp.color === Color.Joker) return;

    if (temp.state === State.Virused && temp.cards[1].color === Color.Joker)
      return;

    if (temp.color !== action.card.color)
      throw "Firewall : générateur cible de couleur incompatible";
    return;
  }

  /* Check if a Generator action is valid

     Check that :
      - The action is correctly specified
      - The slot of the specified color is empty

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionGenerator(action: Action) {
    const cardInHand = this.currentPlayer.hand[action.indexInHand];
    if (!(cardInHand instanceof GeneratorCard)) {
      throw "Generator : pas de générateur en main à l'index";
    }

    if (cardInHand.color !== action.card.color) {
      throw "Generator : mauvaise couleur de générateur";
    }

    const baseSlotTarget = this.currentPlayer.getBase(action.card.color);
    if (this.currentPlayer.base[baseSlotTarget].state !== State.Empty)
      throw "Generator : générateur déjà placé";

    return;
  }
}
