import { ActionSpe } from "./ActionSpe";
import { Card, Color } from "./Card";
import { Generator } from "./Generator";
import { Player, Species } from "./Players";
import { Firewall } from "./Firewall";
import { Virus } from "./Virus";

export class Game {
  players: Player[] = [];
  discard: Card[] = [];
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

    this.addSerieToDeck(construct, 1, Color.Air);
    this.addSerieToDeck(construct, 1, Color.Water);
    this.addSerieToDeck(construct, 3, Color.Energy);
    this.addSerieToDeck(construct, 3, Color.Radiation);
    this.addSerieToDeck(construct, 2, Color.Joker);
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

    If the deck is empty, the Discard deck and the deck are swap.
  */
  draw(n: number) {
    let i: number;
    let card: Card | undefined;

    for (i = 0; i < n; i++) {
      card = this.deck.pop();

      if (card === undefined) {
        [this.deck, this.discard] = [this.discard, this.deck];
        card = this.deck.pop();
      }

      this.players[this.currentPlayer].draw(<Card>card);
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

  discardHand(index: number[]) {
    let i: number;
    for (i of index) {
      this.discard.push(this.players[this.currentPlayer].discardHand(i));
    }
  }

  discardBase(index: number[]) {
    let i: number;
    let oldCard: Card;

    for (i of index) {
      const toDiscard = this.players[this.currentPlayer].discardBase(i);
      for (oldCard of toDiscard) {
        this.discard.push(oldCard);
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

    if (this.players.length == 1) {
      this.endGame(this.players[0]);
    }
  }
}
