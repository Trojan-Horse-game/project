import { ActionSpe } from "./ActionSpe";
import { Card, Color } from "./Card";
import { Generator } from "./Generator";
import { Player, Species } from "./Players";
import { Firewall } from "./Firewall";
import { Virus } from "./Virus";
import { Action } from "./Action";
import { BaseSlot, State } from "./BaseSlot";

/* A class representing a game */
export class Game {
  players: Player[] = [];
  deck: Card[] = [];
  currentPlayer = 0;
  inProgress = false;
  availableSpecies: Species[];

  constructor() {
    this.availableSpecies = [
      Species.Hutex,
      Species.Sonyas,
      Species.Spectre,
      Species.Totox,
      Species.Ulysse,
      Species.Xmars,
    ];
    this.createDeck();
  }

  /* Create the deck by adding the cards
  
     Use addSerieToDeck to add Generators, Virus, Firewall,
     ActionSpe card's to the deck

     To add these series of cards, we follow their distribution
  */
  createDeck() {
    let construct = (color: Color) => {
      return new Generator(color);
    };

    this.addSerieToDeck(construct, 5, Color.Air);
    this.addSerieToDeck(construct, 5, Color.Water);
    this.addSerieToDeck(construct, 5, Color.Energy);
    this.addSerieToDeck(construct, 5, Color.Radiation);
    this.addSerieToDeck(construct, 1, Color.Joker);

    construct = (color: Color) => {
      return new Virus(color);
    };

    this.addSerieToDeck(construct, 4, Color.Air);
    this.addSerieToDeck(construct, 4, Color.Water);
    this.addSerieToDeck(construct, 4, Color.Energy);
    this.addSerieToDeck(construct, 4, Color.Radiation);
    this.addSerieToDeck(construct, 1, Color.Joker);

    construct = (color: Color) => {
      return new Firewall(color);
    };

    this.addSerieToDeck(construct, 4, Color.Air);
    this.addSerieToDeck(construct, 4, Color.Water);
    this.addSerieToDeck(construct, 4, Color.Energy);
    this.addSerieToDeck(construct, 4, Color.Radiation);
    this.addSerieToDeck(construct, 4, Color.Joker);

    construct = (color: Color) => {
      return new ActionSpe(color);
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
    }
  }

  /* Initialize the game

     Shuffle the deck and distribute cards to the players
  */
  init() {
    if (this.players.length >= 2) {
      this.shuffle();
      this.distribute();
      this.inProgress = true;
    }
  }

  /* Shuffle the deck
  
     Complexity of O(n), shuffle Durstenfeld
  */
  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  /* Distribute 3 cards to all players */
  distribute() {
    let i: number;
    this.currentPlayer = 0;

    for (i = 0; i < this.players.length; i++) {
      this.draw(3);
      this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
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
      if (card === undefined) throw "Il n'y a plus de carte dans le deck !";
      this.players[this.currentPlayer].draw(card);
    }
  }

  /* End the player's turn 
  
     Make the player draw a valid number of cards
  */
  endTurn() {
    const handLength = this.players[this.currentPlayer].hand.length;
    if (handLength != 3) {
      this.draw(3 - handLength);
    }

    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
  }

  /* End the game and display the winner */
  endGame(winner: Player) {
    this.inProgress = false;
    console.log(
      "Félicitation " + winner.pseudo + " ! Vous avez remporté la partie! "
    );
  }

  /* Discard cards from the hand of the current player

     Put it back at the bottom of the deck
  */
  discardHand(indices: number[]) {
    let i: number;
    for (i of indices) {
      this.deck.unshift(this.players[this.currentPlayer].discardHand(i));
    }
  }

  /* Discard cards from slots of the current player

     Put them back at the bottom of the deck
  */
  discardBase(index: number[]) {
    let i: number;
    let oldCard: Card;

    for (i of index) {
      const toDiscard = this.players[this.currentPlayer].discardBase(i);
      for (oldCard of toDiscard) {
        this.deck.unshift(oldCard);
      }
    }
  }

  /* Make the current player abandon the game
  
     Discard its hand and its base
  */
  abandon() {
    console.log(
      "Le joueur " + this.players[this.currentPlayer].pseudo + " a abbandonné !"
    );

    this.discardHand([0, 1, 2]);
    this.discardBase([0, 1, 2, 3, 4]);

    this.players.splice(this.currentPlayer, 1);
    this.currentPlayer %= this.players.length;

    if (this.players.length == 1) {
      this.endGame(this.players[0]);
    }
  }

  /* Check if an action is valid and realize it */
  playAction(action: Action) {
    try {
      this.checkAction(action);
      action.card.action(this, action);
    } catch (err) {
      throw err;
    }
  }

  /* Check if an action is valid

     Throw an error if it's not, return the action if it is
  */
  checkAction(action: Action) {
    if (action.card instanceof Generator) this.checkActionGenerator(action);
    else if (action.card instanceof Firewall) this.checkActionFirewall(action);
    else if (action.card instanceof Virus) this.checkActionVirus(action);
    else this.checkActionSpe(action);
  }

  /* Check if a special action is valid

    We don't need to check anything for nuclear distract
    We only check if the action is properly set for Id theft

     Throw an error if it's not, return the action if it is
  */
  checkActionSpe(action: Action) {
    switch (action.card.color) {
      case Color.Water: // Identity theft
        if (action.target[0] === undefined)
          throw "Le vol d'identité n'a pas de cible !";
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
    return action;
  }

  /* Check if a system cleaning action is valid

     Check for every virus cleaned that :
      - The receiver of the "cleaned" virus is not the current player
      - The slot target are properly set
      - The state of both generator are proper (Virused and Generator only)
      - The type of virus sent and the type of the receiver are coherent

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionCleaning(action: Action) {
    let i: number;
    let slotInd = 0;
    let dst: BaseSlot;
    let src: BaseSlot;

    for (i = 0; i < action.target.length; i++) {
      if (action.target[i] === this.currentPlayer)
        throw "Impossible de rejeter un virus sur soi même !";

      if (
        action.slotTarget[slotInd] === undefined ||
        action.slotTarget[slotInd + 1] === undefined
      ) {
        throw "Un des générateurs du nettoyage a mal été annoncé !";
      }

      dst = this.players[action.target[i]].base[action.slotTarget[slotInd + 1]];
      src = this.players[this.currentPlayer].base[action.slotTarget[slotInd]];
      if (src.state !== State.Virused)
        throw "Vous ne pouvez nettoyer un générateur dans un état non infecté !";

      if (dst.state !== State.Generator)
        throw "Vous ne pouvez rejeter vos déchets sur des générateurs non sains !";

      if (
        src.cards[1].color !== Color.Joker &&
        dst.color !== Color.Joker &&
        src.cards[1].color !== dst.color
      ) {
        throw (
          "Vous ne pouvez rejeter un " +
          src.cards[1] +
          " sur un " +
          dst.cards[0] +
          " !"
        );
      }
      slotInd += 2;
    }
  }

  /* Check if a forced exchange action is valid

     Check that :
      - Both the two target and the two slot are specified
      - No immunized or empty generator are part of the exchange
      - No double of an already existing generator are created after the exchange

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionExchange(action: Action) {
    let firstSrc: BaseSlot;
    let secondSrc: BaseSlot;
    let baseInd: number;
    let firstDst: BaseSlot;
    let secondDst: BaseSlot;

    if (action.target[0] === undefined)
      throw "Pas de cible pour l'échange forcé !";
    if (action.slotTarget[0] === undefined)
      throw "Pas de générateur ciblé pour le premier joueur de l'échange forcé !";
    if (action.target[1] === undefined)
      throw "Pas de seconde cible pour l'échange forcé !";
    if (action.slotTarget[1] === undefined)
      throw "Pas de générateur ciblé pour le second joueur de l'échange forcé !";

    firstSrc = this.players[action.target[0]].base[action.slotTarget[0]];
    if (firstSrc.state === State.Immunized)
      throw "Vous ne pouvez échanger un générateur immunisé !";

    if (firstSrc.state === State.Empty)
      throw "Vous ne pouvez pas échanger un générateur inexistant !";

    secondSrc = this.players[action.target[1]].base[action.slotTarget[1]];
    if (secondSrc.state === State.Immunized)
      throw "Vous ne pouvez échanger un générateur immunisé !";
    if (secondSrc.state === State.Empty)
      throw "Vous ne pouvez pas échanger un générateur inexistant !";

    if (firstSrc.color !== secondSrc.color) {
      baseInd = this.players[action.target[1]].getBase(firstSrc.color);
      firstDst = this.players[action.target[1]].base[baseInd];

      baseInd = this.players[action.target[0]].getBase(secondSrc.color);
      secondDst = this.players[action.target[0]].base[baseInd];

      if (firstDst.state !== State.Empty)
        throw "Votre échange ne doit pas créer de doublons de générateurs !";
      if (secondDst.state !== State.Empty)
        throw "Votre échange ne doit pas créer de doublons de générateurs !";
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
    let loanSrc: BaseSlot;
    let loanDst: BaseSlot;
    let baseInd: number;

    if (action.target[0] === undefined)
      throw "Pas de joueur ciblé pour l'emprunt à durée indéterminée !";

    if (action.slotTarget[0] === undefined)
      throw "Pas de générateur ciblé pour l'emprunt à durée indéterminée !";

    loanSrc = this.players[action.target[0]].base[action.slotTarget[0]];
    if (loanSrc.state === State.Immunized)
      throw 'Vous ne pouvez "emprunter" un générateur immunisé !';

    if (loanSrc.state === State.Empty)
      throw 'Vous ne pouvez pas "emprunter" un générateur inexistant !';

    baseInd = this.players[this.currentPlayer].getBase(action.card.color);
    loanDst = this.players[this.currentPlayer].base[baseInd];
    if (loanDst.state !== State.Empty)
      throw 'Vous ne pouvez pas "emprunter" un générateur que vous posséder déjà !';
  }

  /* Check if a Virus action is valid

     Check that :
      - Both the target and the slot are specified
      - No immunized or empty generator are part of the action
      - The color of the virus checks with the targeted generator
      
    The color checks if :
      - The virus is a joker
      - The generator is a joker and is not protected
      - The virus is of a coherent type with the firewall of a protected joker generator
      - The virus attacks a joker firewall
      - The virus is of the same type of the generator's one

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionVirus(action: Action) {
    if (action.target[0] === undefined)
      throw "Le virus n'a pas de joueur cible !";

    if (action.slotTarget[0] === undefined)
      throw "Le virus n'as pas de générateur cible !";

    const temp = this.players[action.target[0]].base[action.slotTarget[0]];
    if (temp.state === State.Empty)
      throw "Vous ne pouvez pas utiliser un virus sur un générateur inexistant !";

    if (temp.state === State.Immunized)
      throw "Vous ne pouvez pas utiliser un virus sur un générateur immunisé !";

    if (action.card.color === Color.Joker) return action;

    if (temp.state !== State.Protected && temp.color === Color.Joker)
      return action;

    if (
      temp.state === State.Protected &&
      temp.color === Color.Joker &&
      temp.cards[1].color === action.card.color
    )
      return action;

    if (temp.state === State.Protected && temp.cards[1].color === Color.Joker)
      return action;

    if (temp.color !== action.card.color)
      throw "Ce type de virus ne peut pas protéger ce type de générateur !";
    return action;
  }

  /* Check if a Firewall action is valid

     Check that :
      - The slot is specified
      - No immunized or empty generator are part of the action
      - The color of the firewall checks with the targeted generator
      
    The color checks if :
      - The firewall is a joker
      - The generator is a joker and is not infected
      - The firewall is of a coherent type with the virus of an infected joker generator
      - The firewall target a joker virus
      - The firewall is of the same type of the generator's one

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionFirewall(action: Action) {
    if (action.slotTarget[0] === undefined)
      throw "Pas de générateur cible du parefeu !";

    const temp = this.players[this.currentPlayer].base[action.slotTarget[0]];
    if (temp.state === State.Empty)
      throw "Vous ne pouvez pas utiliser un parefeu sur un générateur inexistant !";

    if (temp.state === State.Immunized)
      throw "Vous ne pouvez pas utiliser un parefeu sur un générateur immunisé !";

    if (action.card.color === Color.Joker) return action;

    if (temp.state !== State.Virused && temp.color === Color.Joker)
      return action;

    if (
      temp.state === State.Virused &&
      temp.color === Color.Joker &&
      temp.cards[1].color === action.card.color
    )
      return action;

    if (temp.state === State.Virused && temp.cards[1].color === Color.Joker)
      return action;

    if (temp.color !== action.card.color)
      throw "Ce type de parefeu ne peut pas protéger ce type de générateur !";
    return action;
  }

  /* Check if a Generator action is valid

     Check that :
      - The slot of the color specified is empty

     Throw an error if it doesn't check, return the action if it does
  */
  checkActionGenerator(action: Action) {
    const temp = this.players[this.currentPlayer].getBase(action.card.color);

    if (this.players[this.currentPlayer].base[temp].state !== State.Empty)
      throw "The generator is already placed in your base !";

    return action;
  }
}
