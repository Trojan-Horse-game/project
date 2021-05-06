import { Card } from "./Card";
import { GameScene } from "./GameScene";

export interface GameSceneDelegate {
  wasAddedToScene(scene: GameScene);
  createGame(pseudo: string, specie: Species): void;
  joinGame(pseudo: string, roomId: string): void;
  chooseSpecie(specie: Species): void;
  launchGame(roomId: string): void;
  didDropCard(
    card: Card,
    cardIndex: number,
    playerIndex: number,
    generatorIdx: number
  ): void;
  didDiscard(cardsIndices: number[]): void;
}

// vérifier les noms de species et actuzliser la liste "texture"
export enum Species {
  Hutex = "hutex",
  Sonyas = "sonyas",
  Xmars = "xmars",
  Spectre = "spectre",
  Ulysse = "ulysse",
  Totox = "totox"
}
