import { ActionSpe } from "./ActionSpe";
import { Card, Color } from "./Card";
import { Generator } from "./Generator";
import { Player, Species } from "./Players";
import { Firewall } from "./Firewall";
import { Virus } from "./Virus";
import { Action } from "./Action";
import { BaseSlot, State } from "./BaseSlot";

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

  // Add a player to the game
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
    The deck should never be empty
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

  /* End the player's turn */
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

  discardHand(indices: number[]) {
    let i: number;
    for (i of indices) {
      this.deck.unshift(this.players[this.currentPlayer].discardHand(i));
    }
  }

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

  /* Make the current player abandon the game */
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

  checkAction(action: Action) {
    if (action.card instanceof Generator) this.checkActionGenerator(action);
    else if (action.card instanceof Firewall) this.checkActionFirewall(action);
    else if (action.card instanceof Virus) this.checkActionVirus(action);
    else this.checkActionSpe(action);
  }

  checkActionSpe(action: Action) {
    switch (action.card.color) {
      case Color.Water: // Identity theft
        if (action.target[0] === undefined)
          throw "Le vol d'identité n'a pas de cible !";
        break;

      case Color.Joker: // System cleaning TODO
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

    return action;
  }

  checkActionFirewall(action: Action) {
    if (action.slotTarget[0] === undefined)
      throw "Pas de générateur cible du parefeu !";

    const temp = this.players[this.currentPlayer].base[action.slotTarget[0]];
    if (temp.state === State.Empty)
      throw "Vous ne pouvez pas utiliser un parefeu sur un générateur inexistant !";

    if (temp.state === State.Immunized)
      throw "Vous ne pouvez pas utiliser un parefeu sur un générateur immunisé !";

    return action;
  }

  checkActionGenerator(action: Action) {
    const temp = this.players[this.currentPlayer].getBase(action.card.color);

    if (this.players[this.currentPlayer].base[temp].state !== State.Empty)
      throw "The generator is already placed in your base !";

    return action;
  }
}
