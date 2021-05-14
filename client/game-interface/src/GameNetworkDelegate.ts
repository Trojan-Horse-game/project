/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionCard, Card, GeneratorKind, ActionCardKind } from "./Card";
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
      console.log("didDropCard new", cardIndex, playerIndex, generatorIndex);
      const action = new Action(cardIndex);
      action.addTarget(playerIndex);
      action.addSlotTarget(generatorIndex);
      this.socket.emit("play card", { roomId: this.room, action: action });
    } catch (err) {
      console.error(err);
    }
  }

  didDiscard(cardsIndices: number[]) {
    console.log("Did discard", cardsIndices);
    try {
      this.socket.emit("discard", {roomId: this.room, indexDiscard: cardsIndices});
    } catch (err) {
      console.error(err);
    }
  }
}

export class Action {
  card: NetworkCard;
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

export function colorToGenerator(color: NetworkColor): GeneratorKind {
  switch (color) {
    case NetworkColor.Air:
      return GeneratorKind.Air;
    case NetworkColor.Water:
      return GeneratorKind.Water;
    case NetworkColor.Radiation:
      return GeneratorKind.Shield;
    case NetworkColor.Energy:
      return GeneratorKind.Electricity;
    case NetworkColor.Joker:
      return GeneratorKind.Joker;
  }
}

export function colorToAction(color: NetworkColor): ActionCardKind {
  switch (color) {
    case NetworkColor.Air:
      return ActionCardKind.DiscardOpponents;
    case NetworkColor.Joker:
      return ActionCardKind.Spread;
    case NetworkColor.Radiation:
      return ActionCardKind.Steal;
    case NetworkColor.Energy:
      return ActionCardKind.Swap;
    case NetworkColor.Water:
      return ActionCardKind.SwapAll;
  }
}

/* A generic interface for all the cards 

   It is implemented by the class Generator, Virus,
   Firewall and ActionSpe
*/
export interface NetworkCard {
  /*
  constructor(color: NetworkColor) {
    this.color = color;
  }
  */
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
