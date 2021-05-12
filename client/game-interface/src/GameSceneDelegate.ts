import { GameScene } from "./GameScene";
import { Species } from "./GameNetworkDelegate";

export interface GameSceneDelegate {
  wasAddedToScene(scene: GameScene);
  didDropCard(
    cardIndex: number,
    playerIndex: number,
    generatorIdx: number
  ): void;
  didDiscard(cardsIndices: number[]): void;
}
