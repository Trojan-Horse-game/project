import { Card, GeneratorKind } from "./Card";
import { GameSceneDelegate, Species } from "./GameSceneDelegate";
import { io, Socket } from "socket.io-client";
import { NewScene, Player } from "./NewScene";

export class GameScene implements GameSceneDelegate {
  private socket: Socket;
  scene: NewScene;
  players: Player[] = [];
  playersCards: Card[] = [];
  availableSpecies: Species[] = [];
  room: string;
  playerIndex: number;
  winnerIndex: number;

  constructor() {
    this.socket = io();

    this.socket.on("oops", (err) => {
      console.log(err);
    });

    this.socket.on("hand", (hand) => {
      this.playersCards = hand;
    });

    this.socket.on("base", (base) => {
      
    });

    this.socket.on("next turn", (playerIndex) => {
      this.playerIndex = playerIndex;
    });

    this.socket.on("play card", (action) => {
      // update other player's move
    });

    this.socket.on("discard", (indexDiscard, cards) => {
      // ??
    });
    
    this.socket.on("leave game", (playerIdx) => {
        this.scene.removePlayer(playerIdx);
    });
    
    this.socket.on("join game", (pseudo, specie) => {
        let player = new Player(pseudo, specie);
        this.scene.appendPlayer(player);
    });
    
    this.socket.on("end game", (winner) => {
      this.winnerIndex = winner;
    });

    this.socket.on("game id", (roomId) => {
      this.room = roomId;
    });

    this.socket.on("available species", (availableSpecies) => {
      this.availableSpecies = availableSpecies;
    });

    this.socket.on("players", (pseudo, species) => {
        let player = new Player(pseudo, species);
        this.scene.appendPlayer(player)
    });
  }

  didDropCard(
    cardIndex: number,
    playerIndex: number,
    generator: GeneratorKind
  ) {
    try {
      this.socket.emit("play card", this.room);
    } catch (err) {
      console.log(err);
    }
  }

  didDiscard(cardsIndices: number[]) {
    try {
      this.socket.emit("discard", this.room, cardsIndices);
    } catch (err) {
      console.log(err);
    }
  }

  didLaunchGame(roomId: string) {
    try {
      this.socket.emit("launch game", this.room);
    } catch (err) {
      console.log(err);
    }
  }

  didCreateGame(pseudo: string, specie: Species) {
    try {
      this.socket.emit("create game", pseudo, specie);
      // specie index or string ??
      let player = new Player(pseudo, specie);
      this.players.push(player);
      this.scene = new NewScene(this.players, 0);
    } catch (err) {
      console.log(err);
    }
  }

  didJoinGame(pseudo: string, roomId: string) {
    try {
      this.socket.emit("join game", pseudo, this.room);
    } catch (err) {
      console.log(err);
    }
  }

  didChooseSpecie(specie: Species) {
    try {
      this.socket.emit("choose species", specie);
    } catch (err) {
      console.log(err);
    }
  }
}


