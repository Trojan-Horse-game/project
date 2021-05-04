import "phaser";
import { ActionCard, GeneratorCard, Card } from "./Card";
import { Generator, GeneratorState } from "./Generator";
import { PlayerSlot } from "./PlayerSlot";
import { MouseEventFSM } from "./MouseEventFSM";

export class CardSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, card: Card, width: number, height: number) {
    super(scene);
    this.eventFSM = new MouseEventFSM();
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
    this.eventFSM.linkToGameObject(this);
    this.selectionOutline = scene.add.rectangle(
      0,
      -height / 2,
      width + 15,
      height + 15
    );
    this.selectionOutline.setStrokeStyle(5, 0x399fff, 1);
    this.selectionOutline.setAlpha(0);
    this.add(this.selectionOutline);

    this.add(sprite);

    this.eventFSM.drag = () => {
      if (this.parentContainer instanceof PlayerSlot) {
        if (this.parentContainer.selectedCards.indexOf(this) == -1) {
          this.selected = true;
        }
      }
    };

    this.eventFSM.pointerUp = () => {
      this.selected = !this.selected;
    };

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
          position.x + 100,
          position.y + 250
        );
        let minThreshold;
        if (this.parentContainer instanceof PlayerSlot) {
          if (this.parentContainer.selectedCards.length <= 1) {
            minThreshold = 0;
          } else {
            minThreshold = 150 * window.devicePixelRatio;
          }
        }
        let threshold = 75 * window.devicePixelRatio;
        let proportion =
          1 - Math.min(Math.max(0, distance - minThreshold) / threshold, 1);
        let x = proportion * dragX + (1 - proportion) * local.x;
        let y = proportion * dragY + (1 - proportion) * local.y;
        this.setPosition(x, y);

        this.setScale(
          Math.max(
            1 - Math.min((distance / 600) * window.devicePixelRatio, 1),
            0.5
          )
        );
      }
    );

    this.on("dragstart", (pointer: Phaser.Input.Pointer) => {
      // console.log("dragstart - cardsprite");
      this.startX = this.x;
      this.startY = this.y;
    });

    this.on("pointerup", () => {
      // console.log("pointerup - cardsprite");
      // this.selected = !this.selected;
    });

    this.on("dragend", () => {
      // console.log("dragend - cardsprite");
      let threshold = 5 * window.devicePixelRatio;
      scene.tweens.add({
        targets: this,
        x: this.startX,
        y: this.startY,
        alpha: 1,
        scale: 1,
        duration: 400,
        ease: "power4"
      });
    });

    this.on("drop", () => {});

    this.on(
      "dragenter",
      (
        pointer: Phaser.Input.Pointer,
        target: Phaser.GameObjects.GameObject
      ) => {
        if (!(target.parentContainer instanceof PlayerSlot)) {
          return;
        }
        console.log("dragenter", target.parentContainer.selectedCards);
        if (
          target.parentContainer.selectedCards.length <= 1 &&
          target instanceof Generator
        ) {
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

  eventFSM: MouseEventFSM;
  selectedCallback: (boolean) => void;
  private _selected: boolean = false;
  get selected(): boolean {
    return this._selected;
  }

  set selected(newValue) {
    this._selected = newValue;
    this.selectionOutline.setAlpha(newValue ? 1 : 0);
    this.selectedCallback(newValue);
  }

  private selectionOutline: Phaser.GameObjects.Rectangle;

  startX: number;
  startY: number;
  private offsetX: number;
  private offsetY: number;
  static dist(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
