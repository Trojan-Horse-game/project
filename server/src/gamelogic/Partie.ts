import { ActionSpe } from "./ActionSpe";
import { Carte, Couleur } from "./Carte";
import { Generateur } from "./Generateur";
import { Espece, Joueur } from "./Joueurs";
import { PareFeu } from "./PareFeu";
import { Virus } from "./Virus";

export class Partie {
  joueurs: Joueur[] = [];
  defausse: Carte[] = [];
  pioche: Carte[] = [];
  joueurEnCours: number = 0;

  constructor() {
    this.ajouterDeck();
  }

  /* Add the cards to the deck
  
     Use creerSerieDeck to add Generators, Virus, Firewall,
     ActionSpe card's to the deck

     To add these series of cards, we follow their distribution in number
  */
  ajouterDeck() {
    let distrib: [number, Couleur][] = [
      [5, Couleur.Air],
      [5, Couleur.Eau],
      [5, Couleur.Energie],
      [5, Couleur.Radiation],
      [1, Couleur.Joker],
    ];

    let construct = (couleur: Couleur) => {
      return new Generateur(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);

    distrib[0][0] = 4;
    distrib[1][0] = 4;
    distrib[2][0] = 4;
    distrib[3][0] = 4;
    construct = (couleur: Couleur) => {
      return new Virus(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);

    distrib[4][0] = 4; //TODO
    construct = (couleur: Couleur) => {
      return new PareFeu(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);

    distrib[0][0] = 1; // Nuclear distraction
    distrib[1][0] = 1; // Identity theft
    distrib[2][0] = 3; // Forced exchange
    distrib[3][0] = 3; // Indefinite loan
    distrib[4][0] = 2; // System cleaning
    construct = (couleur: Couleur) => {
      return new ActionSpe(couleur);
    };
    this.ajouterSerieDeck(construct, distrib);
  }

  /* Add a serie of cards to the deck

     Use the constructor of a card object to push it to the deck
     Use also the distribution of card the push the right amount of them
  */
  ajouterSerieDeck(
    construct: (couleur: Couleur) => Carte,
    distrib: [number, Couleur][]
  ) {
    let i: number = 0;
    let j: number = 0;
    for (i = 0; i < 5; i++) {
      for (j = 0; j < distrib[i][0]; j++) {
        this.pioche.push(construct(distrib[i][1]));
      }
    }
  }

  // Add a player to the game
  ajouterJoueur(joueur: Joueur) {
    this.joueurs.push(joueur);
  }

  /* Initialize the game

     Shuffle the deck and distribute cards to the players
  */
  init() {
    this.melangePioche();
    this.distribuer();
  }

  /* Shuffle the deck
  
     Complexity of O(n), shuffle Durstenfeld
  */
  melangePioche() {
    for (let i = this.pioche.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.pioche[i], this.pioche[j]] = [this.pioche[j], this.pioche[i]];
    }
  }

  /* Distribute 3 cards to all players */
  distribuer() {
    let i: number;
    this.joueurEnCours = 0;

    for (i = 0; i < this.joueurs.length; i++) {
      this.piocher(3);
      this.joueurEnCours = (this.joueurEnCours + 1) % this.joueurs.length;
    }
  }

  /* Make a player draw n cards
  
    Delete the cards from the deck after drawing them

    If the deck is empty, the Discard deck and the deck are swap.
  */
  piocher(n: number) {
    let i: number;
    let carte: Carte | undefined;

    for (i = 0; i < n; i++) {
      carte = this.pioche.pop();

      if (carte === undefined) {
        [this.pioche, this.defausse] = [this.defausse, this.pioche];
        carte = this.pioche.pop();
      }

      this.joueurs[this.joueurEnCours].piocher(<Carte>carte);
    }
  }

  /* Pass the player's turn */
  passer() {
    this.joueurEnCours = (this.joueurEnCours + 1) % this.joueurs.length;
  }
}
