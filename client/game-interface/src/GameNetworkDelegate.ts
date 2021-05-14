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

  constructor(roomId: string, socket: Socket) {
    this.socket = socket;
    this.room = roomId;
  }

  didDropCard(cardIndex: number, playerIndex: number, generatorIndex: number) {
    try {
      console.log("didDropCard", cardIndex, playerIndex, generatorIndex);
      const action = new Action(cardIndex);
      action.addTarget(playerIndex);
      action.addSlotTarget(generatorIndex);
      action.addTarget(playerIndex);
      this.socket.emit("play card", {roomId: this.room, action: action});
    } catch (err) {
      console.error(err);
    }
  }

  didDiscard(cardsIndices: number[]) {
    console.log("Did discard", cardsIndices);
    try {
      console.log("ok")
      // this.socket.emit("discard", this.room, cardsIndices);
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
