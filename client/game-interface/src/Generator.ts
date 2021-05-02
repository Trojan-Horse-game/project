import "phaser";
import { GeneratorKind } from "./Card";

export enum GeneratorState {
  None,
  Enabled,
  Attacked,
  Protected,
  AlwaysProtected
}

export class Generator extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    radius: number,
    generatorKind: GeneratorKind
  ) {
    super(scene);
    this.strokeWidth = radius * 0.14;

    // Make and add background circle
    this.backgroundCircle = this.scene.add.circle(0, 0, radius);
    this.add(this.backgroundCircle);

    // Make and add generator image
    this.generatorImage = this.scene.add.image(0, 0, generatorKind);
    const imageSize = (radius * 2 - this.strokeWidth) * 0.85;
    this.generatorImage.displayWidth = imageSize;
    this.generatorImage.displayHeight = imageSize;
    this.add(this.generatorImage);

    // Make border
    this.border = this.scene.add.circle(0, 0, radius);
    this.add(this.border);

    this.superImage = this.scene.add.image(
      radius * 0.75,
      radius * 0.75,
      "super_sign"
    );
    const superImageWidth = radius * 0.8;
    this.superImage.setDisplaySize(superImageWidth, superImageWidth);
    this.add(this.superImage);

    // Generators begin with None state
    this.setGeneratorState(GeneratorState.None);
  }

  strokeWidth: number;
  backgroundCircle: Phaser.GameObjects.Arc;
  border: Phaser.GameObjects.Arc;
  generatorImage: Phaser.GameObjects.Image;
  superImage: Phaser.GameObjects.Image;

  setGeneratorState(state: GeneratorState, isSuper = false) {
    if (isSuper) {
      this.superImage.setAlpha(1);
    } else {
      this.superImage.setAlpha(0);
    }
    switch (state) {
      case GeneratorState.None:
        this.backgroundCircle.setFillStyle(0, 0);
        this.border.setStrokeStyle(this.strokeWidth, 0x565455, 1);
        this.generatorImage.setAlpha(0.2);
        break;

      case GeneratorState.Enabled:
        this.backgroundCircle.setFillStyle(0, 0);
        this.border.setStrokeStyle(this.strokeWidth, 0xa8a8a8, 1);
        this.generatorImage.setAlpha(1);
        break;

      case GeneratorState.Protected:
        this.backgroundCircle.setFillStyle(0, 0);
        this.border.setStrokeStyle(this.strokeWidth, 0x84f214, 1);
        this.generatorImage.setAlpha(1);
        break;

      case GeneratorState.AlwaysProtected:
        this.backgroundCircle.setFillStyle(0x84f214, 0.5);
        this.border.setStrokeStyle(this.strokeWidth, 0x84f214, 1);
        this.generatorImage.setAlpha(1);
        break;

      case GeneratorState.Attacked:
        this.backgroundCircle.setFillStyle(0, 0);
        this.border.setStrokeStyle(this.strokeWidth, 0xe61515, 1);
        this.generatorImage.setAlpha(1);
        break;
    }
  }
}
