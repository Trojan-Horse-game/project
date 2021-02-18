export enum Color {
  Air,
  Water,
  Energy,
  Radiation,
  Joker,
}

export interface Card {
  color: Color;
  action(): void;
}
