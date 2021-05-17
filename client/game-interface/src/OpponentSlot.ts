/* eslint-disable @typescript-eslint/no-use-before-define */
import "phaser";
import { ProfilePicture, TextPosition } from "./ProfilePicture";
import { Generator, GeneratorState } from "./Generator";
import { Card, GeneratorKind } from "./Card";
import { CardSprite } from "./CardSprite";
import { GameScene } from "./GameScene";

export class OpponentSlot extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    playerCircleRadius: number,
    slotLayout: SlotLayout,
    name: string,
    pictureName: string,
    index: number
  ) {
    super(scene);
    this.index = index;
    const layoutInfo = new LayoutInfo(slotLayout);
    this.profilePicture = new ProfilePicture(
      scene,
      playerCircleRadius,
      layoutInfo.textPosition,
      pictureName,
      name
    );
    this.add(this.profilePicture);

    let i = 0;
    for (const generatorKind in GeneratorKind) {
      const generatorAngle = layoutInfo.generatorRotationBuilder(i);
      const basePivot = this.scene.add.container();
      const subPivot = this.scene.add.container();
      const generator = new Generator(
        scene,
        0.428 * playerCircleRadius,
        GeneratorKind[generatorKind],
        false,
        i
      );
      generator.setGeneratorState(GeneratorState.Enabled);
      this.generators.push(generator);
      subPivot.setY(-1.642 * playerCircleRadius);
      basePivot.rotation = generatorAngle;
      subPivot.rotation = -generatorAngle;
      subPivot.add(generator);
      basePivot.add(subPivot);
      this.add(basePivot);
      i++;
    }
  }

  profilePicture: ProfilePicture;
  generators: Generator[] = [];
  index: number;
  get timerPercentage(): number {
    return this.profilePicture.timerPercentage;
  }

  set timerPercentage(newValue: number) {
    this.profilePicture.timerPercentage = newValue;
  }

  discardCards(cards: Card[]) {
    if (!(this.scene instanceof GameScene)) {
      return;
    }
    const ratio = 0.7069;
    const cardHeight = window.devicePixelRatio * 60;
    const cardWidth = cardHeight * ratio;

    const cardSprites = cards.map(
      value => new CardSprite(this.scene, value, cardWidth, cardHeight)
    );

    const finalCardHeight = this.scene.deck.deckCards[0].sprite.displayHeight;
    const scaleAmount = finalCardHeight / cardHeight;

    cardSprites.forEach((cardSprite, index) => {
      if (!(this.scene instanceof GameScene)) {
        return;
      }
      cardSprite.setX(this.x);
      cardSprite.setY(this.y);
      cardSprite.setDepth(-100);
      this.scene.add.existing(cardSprite);
      this.scene.tweens.add({
        targets: cardSprite,
        delay: index * 250,
        x: this.scene.deck.x,
        y: this.scene.deck.y + finalCardHeight / 2,
        scale: scaleAmount,
        duration: 900,
        ease: "power4"
      });
    });
  }
}

export enum SlotLayout {
  BottomLeft,
  TopLeft,
  Middle,
  TopRight,
  BottomRight
}

/**
 * This class enables computing where elements should be positioned in
 * function of the given `slotLayout`.
 *
 * Most properties are factors instead of absolute values, meaning they must
 * be multiplied by a base size (the main circle radius) to get actual
 * coordinates.
 */
class LayoutInfo {
  constructor(slotLayout: SlotLayout) {
    switch (slotLayout) {
      case SlotLayout.BottomLeft:
        this.textPosition = TextPosition.Bottom;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-0.5, 0.62);
        break;

      case SlotLayout.BottomRight:
        this.textPosition = TextPosition.Bottom;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-2.0, 0.62);
        break;

      case SlotLayout.TopLeft:
        this.textPosition = TextPosition.Top;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(1.25, 0.62);
        break;

      case SlotLayout.TopRight:
        this.textPosition = TextPosition.Top;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-3.73, 0.62);
        break;

      case SlotLayout.Middle:
        this.textPosition = TextPosition.Top;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(
          1.3089,
          0.9162
        );
        break;
    }
  }

  textPosition: TextPosition;
  generatorRotationBuilder: (index: number) => number;
  index: number;
  static baseYPositionFactor = 1.15;

  static makeGenPosBuild(
    start: number,
    increment: number
  ): (index: number) => number {
    return (index: number): number => {
      return start + increment * index;
    };
  }
}
