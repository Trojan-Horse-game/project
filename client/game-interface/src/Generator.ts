import "phaser";
import {
  GeneratorKind,
  Card,
  GeneratorCard,
  ActionCard,
  GeneratorCardKind
} from "./Card";

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
    generatorKind: GeneratorKind,
    playerGenerator: boolean
  ) {
    super(scene);
    this.strokeWidth = radius * 0.14;
    this.generatorKind = generatorKind;
    this.playerGenerator = playerGenerator;

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

    this.setSize(radius * 2, radius * 2);
    this.setInteractive();
    this.input.dropZone = true;
  }

  generatorState: GeneratorState;
  isSuper: boolean = false;
  generatorKind: GeneratorKind;
  playerGenerator: boolean;
  strokeWidth: number;
  backgroundCircle: Phaser.GameObjects.Arc;
  border: Phaser.GameObjects.Arc;
  generatorImage: Phaser.GameObjects.Image;
  superImage: Phaser.GameObjects.Image;

  setGeneratorState(state: GeneratorState, isSuper = false) {
    this.generatorState = state;
    this.isSuper = isSuper;
    this.setGeneratorDisplayState(state, isSuper);
  }

  resetDisplayState() {
    this.setGeneratorDisplayState(this.generatorState, this.isSuper);
  }

  setGeneratorDisplayState(state: GeneratorState, isSuper = false) {
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
        this.backgroundCircle.setFillStyle(0x84f214, 0.75);
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

  nextState(card: Card): [GeneratorState, boolean] {
    if (card instanceof ActionCard) {
      return [this.generatorState, this.isSuper];
    } else if (card instanceof GeneratorCard) {
      if (
        card.generator == this.generatorKind ||
        ((this.isSuper || card.generator == GeneratorKind.Joker) &&
          card.kind != GeneratorCardKind.Generator)
      ) {
        switch (this.generatorState) {
          case GeneratorState.None:
            if (
              card.kind == GeneratorCardKind.Generator &&
              this.playerGenerator
            ) {
              return [GeneratorState.Enabled, false];
            }
            break;

          case GeneratorState.Enabled:
            if (
              this.playerGenerator &&
              card.kind == GeneratorCardKind.Medicine
            ) {
              return [
                GeneratorState.Protected,
                card.generator == GeneratorKind.Joker
              ];
            } else if (
              !this.playerGenerator &&
              card.kind == GeneratorCardKind.Virus
            ) {
              return [
                GeneratorState.Attacked,
                card.generator == GeneratorKind.Joker
              ];
            }
            break;

          case GeneratorState.Protected:
            if (
              this.playerGenerator &&
              card.kind == GeneratorCardKind.Medicine
            ) {
              return [GeneratorState.AlwaysProtected, false];
            } else if (
              !this.playerGenerator &&
              card.kind == GeneratorCardKind.Virus
            ) {
              return [
                GeneratorState.Enabled,
                card.generator == GeneratorKind.Joker
              ];
            }
            break;

          case GeneratorState.Attacked:
            if (
              this.playerGenerator &&
              card.kind == GeneratorCardKind.Medicine
            ) {
              return [GeneratorState.Enabled, false];
            } else if (
              !this.playerGenerator &&
              card.kind == GeneratorCardKind.Virus
            ) {
              return [GeneratorState.None, false];
            }
            break;

          case GeneratorState.AlwaysProtected:
            return [this.generatorState, this.isSuper];
        }
        return [this.generatorState, this.isSuper];
      }
    } else {
      return [this.generatorState, this.isSuper];
    }
  }
}
