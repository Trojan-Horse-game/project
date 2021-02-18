export enum Color {
  Air,
  Water,
  Energy,
  Radiation,
  Joker,
}

export function colorToString(color: Color): string {
  switch (color) {
    case Color.Air:
      return "d'air";
    case Color.Water:
      return "d'eau";
    case Color.Energy:
      return "d'énergie";
    case Color.Radiation:
      return "de radiation";
    case Color.Joker:
      return "joker";
    default:
      return "unkown";
  }
}

export interface Card {
  color: Color;
  action(): void;
}
