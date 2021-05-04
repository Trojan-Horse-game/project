import { GeneratorKind } from "./Card";

export interface GameSceneDelegate {
  didCreateGame(pseudo: string, specie: Species);
  didJoinGame(pseudo: string, roomId: string);
  didChooseSpecie(specie: Species);
  didLaunchGame(roomId: string);
  didDropCard(cardIndex: number, playerIndex: number, generator: GeneratorKind);
  didDiscard(cardsIndices: number[]);
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
