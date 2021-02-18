import { Card } from "./Card";

export class Action {
  card: Card;
  indexInHand: number;
  target1?: number;
  slotTarget1?: number;
  target2?: number;
  slotTarget2?: number;

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

  addSlotTarget1(slot: number) {
    this.slotTarget1 = slot;
  }

  addSlotTarget2(slot: number) {
    this.slotTarget2 = slot;
  }

  // Check if the action is doable
  // Do the action
}
