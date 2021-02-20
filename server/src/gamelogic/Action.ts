import { Card } from "./Card";

export class Action {
  card: Card;
  indexInHand: number;
  target: number[] = [];
  slotTarget: number[] = [];

  constructor(card: Card, indexInHand: number) {
    this.card = card;
    this.indexInHand = indexInHand;
  }

  addTarget(target: number) {
    this.target.push(target);
  }

  addSlotTarget(slot: number) {
    this.slotTarget.push(slot);
  }
}
