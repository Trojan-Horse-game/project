export const enum Couleur {
  Air,
  Eau,
  Energie,
  Radiation,
  Joker,
}

export interface Carte {
  couleur: Couleur;
  action(): void;
}
