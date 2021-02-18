import { Card } from "./Card";
import { Player } from "./Players";

export class Action {
  card: Card;
  indexInHand: number;
  target1?: number;
  baseSlot1?: number;
  target2?: number;
  baseSlot2?: number;

  constructor(card: Card, indexInHand: number) {
    this.card = card;
    this.indexInHand = indexInHand;
  }

  addTarget1(target: number) {
    this.target1 = target;
  }

  addTarget2(target: number) {
    this.target2 = target;
  }

  addBaseSlot1(slot: number) {
    this.baseSlot1 = slot;
  }

  addBaseSlot2(slot: number) {
    this.baseSlot2 = slot;
  }

  // Check if the action is doable
  // Do the action
}
