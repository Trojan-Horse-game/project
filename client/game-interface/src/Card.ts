export class GeneratorCard {
  constructor(kind: GeneratorCardKind, generator: GeneratorKind) {
    this.generator = generator;
    this.kind = kind;
  }
  generator: GeneratorKind;
  kind: GeneratorCardKind;
}

export class ActionCard {
  constructor(kind: ActionCardKind) {
    this.kind = kind;
  }
  kind: ActionCardKind;
}

export enum ActionCardKind {
  Swap = "swap",
  Steal = "steal",
  Spread = "spread",
  DiscardOpponents = "discard",
  SwapAll = "swap_all"
}

export enum GeneratorCardKind {
  Generator = "G",
  Virus = "V",
  Medicine = "P"
}

export enum GeneratorKind {
  Joker = "joker",
  Shield = "shield",
  Water = "water",
  Air = "air",
  Electricity = "electricity"
}

export type Card = GeneratorCard | ActionCard;
