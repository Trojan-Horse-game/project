export const enum Couleur {
  Air = 1,
  Eau,
  Energie,
  Radiation,
  Joker,
}

export interface Carte {
  couleur: Couleur;
  action(): void;
}
