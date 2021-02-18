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
    const distrib: [number, Color][] = [
      [5, Color.Air],
      [5, Color.Water],
      [5, Color.Energy],
      [5, Color.Radiation],
      [1, Color.Joker],
    ];
    let construct = (color: Color) => {
      return new Generator(color);
    };
    this.addSerieToDeck(construct, distrib);

    distrib[0][0] = 4;
    distrib[1][0] = 4;
    distrib[2][0] = 4;
    distrib[3][0] = 4;
    construct = (color: Color) => {
      return new Virus(color);
    };
    this.addSerieToDeck(construct, distrib);

    distrib[4][0] = 4;
    construct = (color: Color) => {
      return new Firewall(color);
    };
    this.addSerieToDeck(construct, distrib);

    distrib[0][0] = 1; // Nuclear distraction
    distrib[1][0] = 1; // Identity theft
    distrib[2][0] = 3; // Forced exchange
    distrib[3][0] = 3; // Indefinite loan
    distrib[4][0] = 2; // System cleaning
    construct = (color: Color) => {
      return new ActionSpe(color);
    };
    this.addSerieToDeck(construct, distrib);
  }

  /* Add a serie of cards to the deck

     Use the constructor of a card object to push it to the deck
     Use also the distribution of card the push the right amount of them
  */
  addSerieToDeck(
    construct: (color: Color) => Card,
    distrib: [number, Color][]
  ) {
    let i = 0;
    let j = 0;
    for (i; i < 5; i++) {
      for (j; j < distrib[i][0]; j++) {
        this.deck.push(construct(distrib[i][1]));
      }
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
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
  }

  /* End the game and display the winner */
  endGame(winner: Player) {
    this.inProgress = false;
    console.log(
      "Félicitation " + winner.pseudo + " ! Vous avez remporté la partie! "
    );
  }

  /* Make the current player abandon the game */
  abandon() {
    console.log(
      "Le joueur " + this.players[this.currentPlayer].pseudo + " a abbandonné !"
    );
    this.players.splice(this.currentPlayer, 1);

    if (this.players.length == 1) {
      this.endGame(this.players[0]);
    }
  }
}
