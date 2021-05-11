/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card } from "./Card";
import { GameSceneDelegate, Species } from "./GameSceneDelegate";
import { io, Socket } from "socket.io-client";
import { GameScene, Player } from "./GameScene";

export class GameNetworkDelegate implements GameSceneDelegate {
  private socket: Socket;
  scene: GameScene;
  availableSpecies: Species[] = [];
  room: string;
  playerIndex: number;
  winnerIndex: number;

  constructor() {
    this.socket.on("oops", err => {
      console.error(err);
    });

    this.socket.on("available species", availableSpecies => {
      this.availableSpecies = availableSpecies;
    });
  }

  wasAddedToScene(scene: GameScene) {
    this.scene = scene;

    this.socket.on("hand", hand => {
      console.log("hand");
    });

    this.socket.on("next turn", (playerIndex: number) => {
      this.scene.nextTurn(playerIndex);
    });

    this.socket.on("check card", (action: Action, result: string | null) => {
      if (typeof result == "string") return action;
      // Valid action
      else return; // Invalid action
    });

    this.socket.on("play card", (action: Action) => {
      const opponent = action.target[0];
      const slotTarget = action.slotTarget[0];
      // Voir avec trevor
    });

    this.socket.on("discard", (indexDiscard, cards) => {
      // Voir avec trevor
    });

    this.socket.on("leave game", playerIdx => {
      this.scene.removePlayer(playerIdx);
    });

    this.socket.on("join game", (pseudo, specie) => {
      const player = new Player(pseudo, specie);
      this.scene.appendPlayer(player);
    });

    this.socket.on("end game", (winner: number) => {
      this.winnerIndex = winner;
    });

    this.socket.on("game id", (roomId: string) => {
      this.room = roomId;
    });

    this.socket.on("players", (pseudo: string, species) => {
      const player = new Player(pseudo, species);
      this.scene.appendPlayer(player);
    });
  }

  didDropCard(
    card: Card,
    cardIndex: number,
    playerIndex: number,
    generatorIndex: number
  ) {
    try {
      const action = new Action(cardIndex);
      action.addSlotTarget(generatorIndex);
      action.addTarget(playerIndex);
      this.socket.emit("play card", this.room, action);
    } catch (err) {
      console.error(err);
    }
  }

  didDiscard(cardsIndices: number[]) {
    try {
      this.socket.emit("discard", this.room, cardsIndices);
    } catch (err) {
      console.error(err);
    }
  }

  launchGame(roomId: string) {
    try {
      this.socket.emit("launch game", this.room);
    } catch (err) {
      console.error(err);
    }
  }

  createGame(pseudo: string, specie: Species) {
    try {
      this.socket.emit("create game", pseudo, specie);
      // specie index or string ??
      const player = new Player(pseudo, specie);
    } catch (err) {
      console.error(err);
    }
  }

  joinGame(pseudo: string, roomId: string) {
    try {
      this.socket.emit("join game", pseudo, roomId);
    } catch (err) {
      console.error(err);
    }
  }

  chooseSpecie(specie: Species) {
    try {
      this.socket.emit("choose species", specie);
    } catch (err) {
      console.error(err);
    }
  }
}

export class Action {
  indexInHand: number;
  target: number[] = [];
  slotTarget: number[] = [];

  constructor(indexInHand: number) {
    this.indexInHand = indexInHand;
  }

  /* Add a target's index to the action */
  addTarget(target: number) {
    this.target.push(target);
  }

  /* add a BaseSlot's indexx target to the action */
  addSlotTarget(slot: number) {
    this.slotTarget.push(slot);
  }
}
