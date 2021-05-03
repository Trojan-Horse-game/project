import "phaser";
import { ActionCard, GeneratorCard, Card } from "./Card";
import { Generator, GeneratorState } from "./Generator";

export class CardSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, card: Card, width: number, height: number) {
    super(scene);
    let textureName: string;
    if (card instanceof GeneratorCard) {
      textureName = card.generator + "_" + card.kind;
    } else if (card instanceof ActionCard) {
      textureName = card.kind;
    }
    let sprite = scene.add.sprite(0, -height / 2, textureName);
    sprite.setDisplaySize(width, height);
    let hitArea = scene.add.rectangle(
      -width / 2,
      -height,
      width,
      height,
      0xff0000,
      1
    );

    this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    scene.input.setDraggable(this);
    console.log("hitare", this.input.hitArea);

    let rectangle = scene.add.rectangle(
      0,
      -height / 2,
      width + 15,
      height + 15
    );
    rectangle.setStrokeStyle(5, 0x399fff, 1);
    this.add(rectangle);

    this.add(sprite);
    // this.add(hitArea);
    this.on(
      "drag",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        const position = pointer.position;
        const distanceY = CardSprite.dist(
          this.startY,
          this.startY,
          dragY,
          dragY
        );
        const distance = CardSprite.dist(
          this.startX,
          this.startY,
          dragX,
          dragY
        );
        let local = this.parentContainer.getLocalPoint(
          position.x + 70,
          position.y + 190
        );
        let proportion = 1 - Math.min(distance / 300, 1);
        let x = proportion * dragX + (1 - proportion) * local.x;
        let y = proportion * dragY + (1 - proportion) * local.y;
        this.setPosition(x, y);
        // this.setAlpha(1 - 0.2 * (1 - proportion));

        // this.setPosition(dragX, dragY);

        this.setScale(
          Math.max(
            this.startScale -
              Math.min((distance / 600) * window.devicePixelRatio, 1),
            0.35
          )
        );
      }
    );

    this.on("dragstart", (pointer: Phaser.Input.Pointer) => {
      this.startX = this.x;
      this.startY = this.y;
      this.startScale = 1;
    });

    this.on("dragend", () => {
      scene.tweens.add({
        targets: this,
        x: this.startX,
        y: this.startY,
        alpha: 1,
        scale: this.startScale,
        duration: 400,
        ease: "power4"
      });
    });

    this.on("drop", () => {
      console.log("drop");
    });

    this.on(
      "dragenter",
      (
        pointer: Phaser.Input.Pointer,
        target: Phaser.GameObjects.GameObject
      ) => {
        if (target instanceof Generator) {
          const nextState = target.nextState(card);
          target.setGeneratorDisplayState(nextState[0], nextState[1]);
        }
      }
    );

    this.on(
      "dragleave",
      (
        pointer: Phaser.Input.Pointer,
        target: Phaser.GameObjects.GameObject
      ) => {
        if (target instanceof Generator) {
          target.resetDisplayState();
        }
      }
    );
  }
  private startX: number;
  private startY: number;
  private offsetX: number;
  private offsetY: number;
  private startScale: number;
  static dist(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
