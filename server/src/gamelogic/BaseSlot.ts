import { Color } from "./Card";

/* One slot of a base */
export class BaseSlot {
  state: number;
  color: Color;

  constructor(state: number, color: number) {
    this.state = state;
    this.color = color;
  }
}
