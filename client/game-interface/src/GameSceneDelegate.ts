import { GameScene } from "./GameScene";
import { Species } from "./GameNetworkDelegate";

export interface GameSceneDelegate {
  wasAddedToScene(scene: GameScene);
  createGame(pseudo: string, specie: Species): void;
  joinGame(pseudo: string, roomId: string): void;
  chooseSpecie(specie: Species): void;
  launchGame(roomId: string): void;
  didDropCard(
    cardIndex: number,
    playerIndex: number,
    generatorIdx: number
  ): void;
  didDiscard(cardsIndices: number[]): void;
}
