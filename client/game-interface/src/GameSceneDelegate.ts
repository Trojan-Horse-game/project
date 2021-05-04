import { GeneratorKind } from "./Card";

export interface GameSceneDelegate {
  didDropCard(cardIndex: number, playerIndex: number, generator: GeneratorKind);
  didDiscard(cardsIndices: number[]);
}
