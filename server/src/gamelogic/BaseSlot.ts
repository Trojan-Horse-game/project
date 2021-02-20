import { Card, Color } from "./Card";

export enum State {
  Empty,
  Generator,
  Virused,
  Protected,
  Immunized,
}

/* One slot of a base */
export class BaseSlot {
  state: State;
  color: Color;
  cards: Card[] = [];

  constructor(state: State, color: number) {
    this.state = state;
    this.color = color;
  }

  toString(): string {
    switch (this.state) {
      case State.Empty:
        return "Case vide";
      case State.Generator:
        return "Génerateur " + Color[this.color];
      case State.Virused:
        return (
          "Génerateur ' " +
          Color[this.color] +
          " contaminé par " +
          this.cards[1] +
          " !"
        );
      case State.Protected:
        return (
          "Génerateur " +
          Color[this.color] +
          " protégé par " +
          this.cards[1] +
          " !"
        );
      case State.Immunized:
        return "Génerateur " + Color[this.color] + " immunisé !";
      default:
        return "unkown";
    }
  }
}
