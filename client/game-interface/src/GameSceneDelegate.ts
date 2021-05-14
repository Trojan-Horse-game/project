import { GameScene } from "./GameScene";
import { Species } from "./GameNetworkDelegate";

export interface GameSceneDelegate {
  didDropCard(
    cardIndex: number,
    playerIndex: number,
    generatorIdx: number
  ): void;
  didDiscard(cardsIndices: number[]): void;
}
