import { Card, Color } from "./Card";

export enum State {
  Empty,
  Generator,
  Virused,
  Protected,
  Immunized,
}

/* A class for one slot of a player's base

   The state property is used to have a fast way of checking
   which cards compose the slot
*/
export class GeneratorSlot {
  state: State;
  color: Color;
  cards: Card[] = [];

  constructor(state: State, color: number) {
    this.state = state;
    this.color = color;
  }

  /* Change slot state by adding a generator */
  addGenerator(generator: Card) {
    this.state = State.Generator;
    this.cards.push(generator);
  }

  addVirus(virus: Card): State {
    if (this.state === State.Virused) this.state = State.Empty;
    else if (this.state === State.Protected) this.state = State.Generator;
    else if (this.state === State.Generator) this.state = State.Virused;
    else
      throw "addVirus : state != Virused, Protected ou Generator avant infection par le virus";

    this.cards.push(virus);
    return this.state;
  }

  addFireWall(fireWall: Card): State {
    if (this.state === State.Generator) this.state = State.Protected;
    else if (this.state === State.Protected) this.state = State.Immunized;
    else if (this.state === State.Virused) this.state = State.Generator;
    else
      throw "addFireWall : state != Virused,Protected ou Generator avant pose d'un parfeu";

    this.cards.push(fireWall);
    return this.state;
  }

  toString(): string {
    switch (this.state) {
      case State.Empty:
        return "Case vide";

      case State.Generator:
        return "Génerateur " + Color[this.color];

      case State.Virused:
        return (
          "Génerateur " +
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
