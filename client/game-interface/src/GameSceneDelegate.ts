import { GameScene } from "./GameScene";
import { Specie } from "./GameNetworkDelegate";

export interface GameSceneDelegate {
  wasAddedToScene(scene: GameScene);
  createGame(pseudo: string, specie: Specie): void;
  joinGame(pseudo: string, roomId: string): void;
  chooseSpecie(specie: Specie): void;
  launchGame(roomId: string): void;
  didDropCard(
    cardIndex: number,
    playerIndex: number,
    generatorIdx: number
  ): void;
  didDiscard(cardsIndices: number[]): void;
}
