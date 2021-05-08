import "phaser";
import { ActionCard, GeneratorCard, Card } from "./Card";
import { Generator, GeneratorState } from "./Generator";
import { PlayerSlot } from "./PlayerSlot";
import { MouseEventFSM } from "./MouseEventFSM";
import { CardDeck } from "./CardDeck";
import { GameScene } from "./GameScene";

export class CardSprite extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    card: Card | null,
    width: number,
    height: number
  ) {
    super(scene);
    this.eventFSM = new MouseEventFSM();
    this.sprite = scene.add.sprite(0, -height / 2, "carte_verso");
    this.sprite.setDisplaySize(width, height);
    this.cardType = card;
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
    this.add(this.sprite);

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
        const distance = CardSprite.dist(
          this.startX,
          this.startY,
          dragX,
          dragY
        );
        const local = this.parentContainer.getLocalPoint(
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
        const threshold = 75 * window.devicePixelRatio;
        const proportion =
          1 - Math.min(Math.max(0, distance - minThreshold) / threshold, 1);
        const x = proportion * dragX + (1 - proportion) * local.x;
        const y = proportion * dragY + (1 - proportion) * local.y;
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
      this.startX = this.x;
      this.startY = this.y;
      this.startWidth = this.displayWidth;
      this.startHeight = this.displayHeight;
    });

    this.on(
      "drop",
      (
        pointer: Phaser.Input.Pointer,
        target: Phaser.GameObjects.GameObject
      ) => {
        if (!(scene instanceof GameScene)) {
          return;
        }

        const playerSlot = scene.playerSlot;
        if (target instanceof CardDeck) {
          let discarded: number[] = [];
          scene.tweens.add({
            targets: playerSlot.selectedCards,
            alpha: 0,
            scale: 0,
            duration: 400,
            ease: "power4"
          });
          for (const selectedCard of playerSlot.selectedCards) {
            selectedCard.dropped = true;
            discarded.push(playerSlot.cards.indexOf(selectedCard));
          }
          playerSlot.discardedIndices = discarded;
          playerSlot.selectedCards = [];
          if (scene.delegate != null) {
            scene.delegate.didDiscard(discarded);
          }
        }
      }
    );

    this.on(
      "dragenter",
      (
        pointer: Phaser.Input.Pointer,
        target: Phaser.GameObjects.GameObject
      ) => {
        if (!(this.parentContainer instanceof PlayerSlot)) {
          return;
        }
        if (
          this.parentContainer.selectedCards.length <= 1 &&
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
  private _selected = false;
  get selected(): boolean {
    return this._selected;
  }

  set selected(newValue) {
    this._selected = newValue;
    this.selectionOutline.setAlpha(newValue ? 1 : 0);
    this.selectedCallback(newValue);
  }

  private _cardAngle: number;
  get cardAngle(): number {
    return this._cardAngle;
  }

  set cardAngle(newValue: number) {
    this._cardAngle = newValue;
    this.sprite.setAngle(newValue);
    this.selectionOutline.setAngle(newValue);
  }

  private _cardType: Card;
  get cardType(): Card {
    return this._cardType;
  }
  set cardType(newValue: Card) {
    this._cardType = newValue;
    let textureName: string;
    if (newValue == null) {
      textureName = "carte_verso";
    } else if (newValue instanceof GeneratorCard) {
      textureName = newValue.generator + "_" + newValue.kind;
    } else if (newValue instanceof ActionCard) {
      textureName = newValue.kind;
    }
    let oldWidth = this.sprite.displayWidth;
    let oldHeight = this.sprite.displayHeight;
    this.sprite.setTexture(textureName);
    this.sprite.setDisplaySize(oldWidth, oldHeight);
  }

  private selectionOutline: Phaser.GameObjects.Rectangle;
  sprite: Phaser.GameObjects.Sprite;

  dropped: boolean;

  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  private offsetX: number;
  private offsetY: number;
  static dist(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
