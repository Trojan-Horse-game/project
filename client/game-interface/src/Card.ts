export class GeneratorCard {
  constructor(kind: GeneratorCardKind, generator: GeneratorKind) {
    this.generator = generator;
    this.kind = kind;
  }
  generator: GeneratorKind;
  kind: GeneratorCardKind;
  gameLogicIdx: number;
}

export class ActionCard {
  constructor(kind: ActionCardKind) {
    this.kind = kind;
  }
  kind: ActionCardKind;
  gameLogicIdx: number;
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
  Air = "air",
  Water = "water",
  Electricity = "electricity",
  Shield = "shield",
  Joker = "joker"
}

export type Card = GeneratorCard | ActionCard;
