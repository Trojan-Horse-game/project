import "phaser";
import { ActionCard, GeneratorCard, ActionCardKind, Card } from "./Card";

export class CardSprite extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, card: Card) {
    let textureName: string;
    if (card instanceof GeneratorCard) {
      textureName = card.generator + "_" + card.kind;
    } else if (card instanceof ActionCard) {
      textureName = card.kind;
    }
    super(scene, 0, 0, textureName);
  }
}
