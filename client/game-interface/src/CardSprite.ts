import "phaser";
import { ActionCard, GeneratorCard, Card } from "./Card";

export class CardSprite extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, card: Card) {
    let textureName: string;
    if (card instanceof GeneratorCard) {
      textureName = card.generator + "_" + card.kind;
      //console.log(textureName);
    } else if (card instanceof ActionCard) {
      textureName = card.kind;
    }
    super(scene, 0, 0, textureName);
    this.setInteractive();
    this.on(
      "drag",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        this.setPosition(dragX, dragY);
        const distance = CardSprite.dist(
          this.startX,
          this.startY,
          dragX,
          dragY
        );
        this.setScale(
          Math.max(this.startScale - Math.min(distance / 800, 1), 0.35)
        );
      }
    );

    this.on("dragstart", () => {
      this.startX = this.x;
      this.startY = this.y;
      this.startScale = this.scale;
    });

    this.on("dragend", () => {
      scene.tweens.add({
        targets: this,
        x: this.startX,
        y: this.startY,
        scale: this.startScale,
        duration: 400,
        ease: "power4"
      });
    });
  }
  private startX: number;
  private startY: number;
  private startScale: number;
  static dist(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x2, 2) + Math.pow(y2 - y1, 2));
  }
}
