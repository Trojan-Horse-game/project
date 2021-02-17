import { Color, colorToString } from "./Card";

export const enum State {
  Empty,
  Generator,
  Virused,
  Protected,
  Immuned,
}

/* One slot of a base */
export class BaseSlot {
  state: State;
  color: Color;

  constructor(state: State, color: number) {
    this.state = state;
    this.color = color;
  }

  toString(): string {
    switch (this.state) {
      case State.Empty:
        return "Case vide";
      case State.Generator:
        return "Génerateur " + colorToString(this.color);
      case State.Virused:
        return "Génerateur " + colorToString(this.color) + " contaminé !";
      case State.Protected:
        return "Génerateur " + colorToString(this.color) + " protégé !";
      case State.Immuned:
        return "Génerateur " + colorToString(this.color) + " immunisé !";
      default:
        return "unkown";
    }
  }
}
