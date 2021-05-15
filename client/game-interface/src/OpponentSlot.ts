/* eslint-disable @typescript-eslint/no-use-before-define */
import "phaser";
import { ProfilePicture, TextPosition } from "./ProfilePicture";
import { Generator, GeneratorState } from "./Generator";
import { GeneratorKind } from "./Card";

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
      this.generators.set(generatorKind, generator);
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
  generators = new Map<string, Generator>();
  index: number;
  get timerPercentage(): number {
    return this.profilePicture.timerPercentage;
  }

  set timerPercentage(newValue: number) {
    this.profilePicture.timerPercentage = newValue;
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
