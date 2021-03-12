import { Card } from "./Card";

/* A class Action containing a required action of a player

   The class is minimalist to permit fast network transmission of its data
   It can represents any usage of a card
*/
export class Action {
  card: Card;
  indexInHand: number;
  target: number[] = [];
  slotTarget: number[] = [];

  constructor(card: Card, indexInHand: number) {
    this.card = card;
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
