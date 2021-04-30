import "phaser";

export class PlayerSlot extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    playerCircleRadius: number,
    slotLayout: SlotLayout,
    name: string,
    pictureName: string
  ) {
    super(scene);
    let layoutInfo = new LayoutInfo(slotLayout);
    let profilePicture = new PlayerProfilePicture(
      scene,
      playerCircleRadius,
      pictureName
    );
    this.add(profilePicture);

    let nameText = this.scene.add.text(0, 0, name.toUpperCase());
    nameText.setOrigin(0.5, layoutInfo.textYOrigin);
    nameText.setY(layoutInfo.textYPositionFactor * playerCircleRadius);
    nameText.setFontSize(playerCircleRadius * 0.38);
    nameText.setFontFamily("Gagalin");
    let padding = playerCircleRadius * 0.0857;
    nameText.setPadding(padding, 0, padding, padding);
    nameText.style.setAlign("center");
    nameText.style.setColor("FFFFFF");
    nameText.style.setBackgroundColor("555455");
    this.add(nameText);

    // TODO: replace the circles with the actual generators
    let i = 0;
    for (let generatorKind in GeneratorKind) {
      let generatorInfo = layoutInfo.generatorRotationBuilder(i);
      let basePivot = this.scene.add.container();
      let subPivot = this.scene.add.container();
      let generator = new Generator(
        scene,
        0.428 * playerCircleRadius,
        GeneratorKind[generatorKind]
      );
      this.generators.set(generatorKind, generator);
      subPivot.setY(-1.642 * playerCircleRadius);
      generator.setY(generatorInfo.yOffsetFactor * playerCircleRadius);

      basePivot.rotation = generatorInfo.rotation;
      subPivot.rotation = -generatorInfo.rotation;
      subPivot.add(generator);
      basePivot.add(subPivot);
      this.add(basePivot);
      i++;
    }
  }
  generators = new Map<string, Generator>();
}

class PlayerProfilePicture extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, radius: number, pictureName: string) {
    super(scene);
    let strokeWidth = radius * 0.15;

    // The width of the black inner stroke that separates the
    // character picture from the main border
    let innerStrokeWidth = strokeWidth / 1.7;

    // Create and add image
    let image = this.scene.add.image(0, 0, pictureName);
    let imageSize = radius * 2 - strokeWidth;
    image.displayWidth = imageSize;
    image.displayHeight = imageSize;
    this.add(image);

    // Create borders
    let innerCircle = this.scene.add.circle(0, 0, radius - innerStrokeWidth);
    innerCircle.setStrokeStyle(innerStrokeWidth, 0x0, 1);
    this.add(innerCircle);

    let outerCircle = this.scene.add.circle(0, 0, radius);
    outerCircle.setStrokeStyle(strokeWidth, 0x565455, 1);
    this.add(outerCircle);

    this.timerArc = this.scene.add.arc(0, 0, radius, -90, -90);
    this.timerArc.closePath = false;
    this.timerArc.setStrokeStyle(strokeWidth, 0x0082fd, 1);
    this.add(this.timerArc);
  }

  timerArc: Phaser.GameObjects.Arc;

  _timerPercentage: number = 0;

  get timerPercentage(): number {
    return this._timerPercentage;
  }

  set timerPercentage(newValue: number) {
    this._timerPercentage = newValue;
    this.timerArc.endAngle = -90 + 360 * newValue;
  }
}

class Generator extends Phaser.GameObjects.Container {
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
    let imageSize = (radius * 2 - this.strokeWidth) * 0.85;
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
    let superImageWidth = radius * 0.8;
    this.superImage.setDisplaySize(superImageWidth, superImageWidth * 1.38);
    this.add(this.superImage);

    // Generators begin with None state
    this.setGeneratorState(GeneratorState.Enabled);
  }

  strokeWidth: number;
  backgroundCircle: Phaser.GameObjects.Arc;
  border: Phaser.GameObjects.Arc;
  generatorImage: Phaser.GameObjects.Image;
  superImage: Phaser.GameObjects.Image;

  setGeneratorState(state: GeneratorState, isSuper: boolean = false) {
    if (isSuper) {
      this.superImage.setAlpha(1);
    } else {
      this.superImage.setAlpha(0);
    }
    switch (state) {
      case GeneratorState.None:
        this.backgroundCircle.setFillStyle(0, 0);
        this.border.setStrokeStyle(this.strokeWidth, 0x565455, 1);
        this.generatorImage.setAlpha(0.3);
        break;

      case GeneratorState.Enabled:
        this.backgroundCircle.setFillStyle(0, 0);
        this.border.setStrokeStyle(this.strokeWidth, 0x565455, 1);
        this.generatorImage.setAlpha(1);
        break;

      case GeneratorState.Protected:
        this.backgroundCircle.setFillStyle(0, 0);
        this.border.setStrokeStyle(this.strokeWidth, 0x84f214, 1);
        this.generatorImage.setAlpha(1);
        break;

      case GeneratorState.AlwaysProtected:
        this.backgroundCircle.setFillStyle(0x84f214, 0.3);
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

enum GeneratorKind {
  Joker = "super",
  Shield = "radiation",
  Water = "eau",
  Air = "air",
  Electricity = "foudre",
}

enum GeneratorState {
  None,
  Enabled,
  Attacked,
  Protected,
  AlwaysProtected,
}

export enum SlotLayout {
  BottomLeft,
  TopLeft,
  Middle,
  TopRight,
  BottomRight,
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
        this.textYOrigin = 0;
        this.textYPositionFactor = LayoutInfo.baseYPositionFactor;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(
          -0.174,
          0.62,
          4
        );
        break;

      case SlotLayout.BottomRight:
        this.textYOrigin = 0;
        this.textYPositionFactor = LayoutInfo.baseYPositionFactor;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(
          -2.306,
          0.62,
          0
        );
        break;

      case SlotLayout.TopLeft:
        this.textYOrigin = 1;
        this.textYPositionFactor = -LayoutInfo.baseYPositionFactor;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(0.875, 0.7);
        break;

      case SlotLayout.TopRight:
        this.textYOrigin = 1;
        this.textYPositionFactor = -LayoutInfo.baseYPositionFactor;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-3.675, 0.7);
        break;

      case SlotLayout.Middle:
        this.textYOrigin = 1;
        this.textYPositionFactor = -LayoutInfo.baseYPositionFactor;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(
          1.3089,
          0.9162
        );
        break;
    }
  }

  textYOrigin: number;
  textYPositionFactor: number;
  generatorRotationBuilder: (index: number) => GeneratorPosition;

  static baseYPositionFactor: number = 1.15;

  static makeGenPosBuild(
    start: number,
    increment: number,
    offsetIndex?: number
  ): (index: number) => GeneratorPosition {
    return (index: number): GeneratorPosition => {
      if (offsetIndex == undefined || offsetIndex != index) {
        return new GeneratorPosition(start + increment * index, 0);
      } else {
        let builder = LayoutInfo.makeGenPosBuild(start, increment, offsetIndex);
        let last = builder(offsetIndex == 0 ? index + 1 : index - 1);
        return new GeneratorPosition(last.rotation, 1.05);
      }
    };
  }

  static deg2rad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

class GeneratorPosition {
  constructor(rotation: number, yOffsetFactor: number) {
    this.rotation = rotation;
    this.yOffsetFactor = yOffsetFactor;
  }
  rotation: number;
  yOffsetFactor: number;
}
