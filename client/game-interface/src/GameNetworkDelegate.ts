/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card } from "./Card";
import { GameSceneDelegate } from "./GameSceneDelegate";
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
    this.socket = io();

    this.socket.on("oops", err => {
      console.error(err);
    });

    this.socket.on("available species", availableSpecies => {
      this.availableSpecies = availableSpecies;
    });
  }

  wasAddedToScene(scene: GameScene) {
    this.scene = scene;

    this.socket.on("hand", (hand: NetworkCard[], kind: string[]) => {
      console.log("hand");
    });

    this.socket.on("base", (generators: GeneratorSlot[], idx: number) => {
      console.log("base");
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

    this.socket.on(
      "players",
      (pseudo: string[], species: Species[], playerIndex: number) => {
        const players: Player[] = [];
        for (let i = 0; i < pseudo.length; i++) {
          players.push(new Player(pseudo[i], species[i]));
        }
        this.scene.updatePlayers(players, -1);
      }
    );
  }

  didDropCard(cardIndex: number, playerIndex: number, generatorIndex: number) {
    try {
      console.log("didDropCard", cardIndex, playerIndex, generatorIndex);
      const action = new Action(cardIndex);
      action.addTarget(playerIndex);
      action.addSlotTarget(generatorIndex);
      action.addTarget(playerIndex);
      this.socket.emit("play card", this.room, action);
    } catch (err) {
      console.error(err);
    }
  }

  didDiscard(cardsIndices: number[]) {
    console.log("Did discard", cardsIndices);
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

export enum NetworkColor {
  Air,
  Water,
  Energy,
  Radiation,
  Joker
}

/* A generic interface for all the cards 

   It is implemented by the class Generator, Virus,
   Firewall and ActionSpe
*/
export interface NetworkCard {
  color: NetworkColor;
}

export class GeneratorSlot {
  state: NetworkState;
  color: NetworkColor;
  // cards: Card[] = [];
}

export enum NetworkState {
  Empty,
  Generator,
  Virused,
  Protected,
  Immunized
}

export enum Species {
  Hutex,
  Robotec,
  Xmars,
  Spectre,
  Fawkes,
  Totox
}

export function specieToString(specie: Species): string {
  switch (specie) {
    case Species.Hutex:
      return "hutex";
    case Species.Robotec:
      return "robotec";
    case Species.Xmars:
      return "xmars";
    case Species.Spectre:
      return "spectre";
    case Species.Fawkes:
      return "fawkes";
    case Species.Totox:
      return "totox";
  }
}

export function stringToSpecie(specie: string): Species {
  switch (specie) {
    case "hutex":
      return Species.Hutex;
    case "robotec":
      return Species.Robotec;
    case "xmars":
      return Species.Xmars;
    case "spectre":
      return Species.Spectre;
    case "fawkes":
      return Species.Fawkes;
    case "totox":
      return Species.Totox;
  }
}
