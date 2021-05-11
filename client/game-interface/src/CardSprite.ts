import "phaser";
import { ActionCard, GeneratorCard, Card } from "./Card";
import { Generator } from "./Generator";
import { PlayerSlot } from "./PlayerSlot";
import { MouseEventFSM } from "./MouseEventFSM";
import { CardDeck } from "./CardDeck";
import { GameScene } from "./GameScene";
import { ActionDropZone } from "./ActionDropZone";
import { OpponentSlot } from "./OpponentSlot";

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
    const hitArea = scene.add.rectangle(
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
    const margin = 7.5 * window.devicePixelRatio;
    this.selectionOutline = scene.add.rectangle(
      0,
      -height / 2,
      width + margin,
      height + margin
    );
    this.selectionOutline.setStrokeStyle(
      2.5 * window.devicePixelRatio,
      0x399fff,
      1
    );
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

    this.eventFSM.dragStart = () => {
      if (!(this.scene instanceof GameScene)) {
        return;
      }
      /*
      this.scene.tweens.add({
        targets: this.scene.deck,
        delay: 0,
        x: this.scene.deck.x + 100 * window.devicePixelRatio,
        duration: 1000,
        ease: "power4"
      });

      
      this.scene.tweens.add({
        targets: this.scene.actionDropZone,
        delay: 0,
        alpha: 1,
        scale: 1,
        duration: 1000,
        ease: "power4"
      });
      */
    };

    this.eventFSM.dragEnd = () => {
      if (this.dropped) {
        return;
      }

      if (!(this.scene instanceof GameScene)) {
        return;
      }
      /*
      this.scene.tweens.add({
        targets: this.scene.deck,
        delay: 300,
        x: this.scene.deck.x - 100 * window.devicePixelRatio,
        duration: 1000,
        ease: "power4"
      });

      this.scene.tweens.add({
        targets: this.scene.actionDropZone,
        delay: 300,
        alpha: 0,
        scale: 0.5,
        duration: 1000,
        ease: "power4"
      });
      */
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
          position.x + 50 * window.devicePixelRatio,
          position.y + 125 * window.devicePixelRatio
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.on("dragstart", (pointer: Phaser.Input.Pointer) => {
      this.startX = this.x;
      this.startY = this.y;
      this.startWidth = this.sprite.displayWidth;
      this.startHeight = this.sprite.displayHeight;
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
          const discarded: number[] = [];
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
        } else if (target instanceof ActionDropZone) {
          this.dropped = true;
          const globalX = this.x + this.parentContainer.x;
          const globalY = this.y + this.parentContainer.y;
          this.parentContainer.remove(this);
          this.setPosition(globalX, globalY);
          this.removeAllListeners();
          this.selected = false;
          const local = scene.actionDropZone.getLocalPoint(globalX, globalY);
          scene.actionDropZone.add(this);
          this.setPosition(local.x, local.y);
          scene.tweens.add({
            targets: this,
            x: 0,
            y: +this.sprite.displayHeight / 4,
            duration: 250,
            ease: "power4"
          });
          this.scene.tweens.add({
            targets: target.text,
            delay: 100,
            alpha: 0,
            duration: 600,
            ease: "power4"
          });
          const baseScale = target.circle.scale;
          this.scene.tweens.add({
            targets: target.circle,
            scale: baseScale * 1.1,
            duration: 500,
            ease: "power4"
          });

          this.scene.tweens.add({
            targets: target.circle,
            angle: 359.999,
            repeat: 100,
            duration: 1000
          });

          this.scene.tweens.add({
            targets: target.circle,
            scale: baseScale * 1.3,
            delay: 100,
            duration: 1000
          });

          this.scene.tweens
            .add({
              targets: target.circle,
              alpha: 0,
              scale: 0,
              delay: 1200,
              duration: 600,
              ease: "power4"
            })
            .on("complete", () => {
              const newPosition = scene.deck.getLocalPoint(
                this.x + this.parentContainer.x,
                this.y + this.parentContainer.y
              );

              target.remove(this);
              scene.deck.add(this);
              scene.deck.sendToBack(this);
              this.setPosition(newPosition.x, newPosition.y);
            });
          this.scene.tweens.add({
            targets: this,
            x: 0,
            y: this.startHeight / 2,
            scale: 1,
            delay: 1800,
            duration: 500,
            ease: "power4"
          });

          this.scene.tweens.add({
            targets: scene.deck,
            delay: 2100,
            x: scene.deck.x - 100 * window.devicePixelRatio,
            duration: 600,
            ease: "power4"
          });
        } else if (
          target instanceof Generator &&
          this.parentContainer instanceof PlayerSlot
        ) {
          let targetPlayerIndex;
          if (target.parentContainer instanceof PlayerSlot) {
            targetPlayerIndex = scene.playerIndex;
          } else if (
            target.parentContainer.parentContainer.parentContainer instanceof
            OpponentSlot
          ) {
            targetPlayerIndex =
              target.parentContainer.parentContainer.parentContainer.index;
          }
          scene.delegate.didDropCard(
            this.parentContainer.cards.indexOf(this),
            targetPlayerIndex,
            target.index
          );
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
        if (this.parentContainer.selectedCards.length <= 1) {
          if (target instanceof Generator) {
            const nextState = target.nextState(card);
            target.setGeneratorDisplayState(nextState[0], nextState[1]);
          } else if (target instanceof ActionDropZone) {
            const baseScale = target.circle.scale;
            this.scene.tweens.add({
              targets: target.circle,
              scale: baseScale / 1.1,
              duration: 100
            });
          }
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
        } else if (target instanceof ActionDropZone) {
          const baseScale = target.circle.scale;
          this.scene.tweens.add({
            targets: target.circle,
            scale: baseScale * 1.1,
            duration: 100
          });
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
    const oldWidth = this.sprite.displayWidth;
    const oldHeight = this.sprite.displayHeight;
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
