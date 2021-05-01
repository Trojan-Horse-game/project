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
    this.profilePicture = new PlayerProfilePicture(
      scene,
      playerCircleRadius,
      layoutInfo.textPosition,
      pictureName,
      name
    );
    this.add(this.profilePicture);

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

  profilePicture: PlayerProfilePicture;
  generators = new Map<string, Generator>();

  get timerPercentage(): number {
    return this.profilePicture.timerPercentage;
  }

  set timerPercentage(newValue: number) {
    this.profilePicture.timerPercentage = newValue;
  }
}

class PlayerProfilePicture extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    radius: number,
    textPosition: TextPosition,
    pictureName: string,
    playerName: string
  ) {
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

    // Create text
    this.nameText = this.scene.add.text(0, 0, playerName.toUpperCase());
    this.nameText.setOrigin(0.5, textPosition == TextPosition.Bottom ? 0 : 1);
    let yTextPosFactor = textPosition == TextPosition.Top ? -1.15 : 1.15;
    this.nameText.setY(yTextPosFactor * radius);
    this.nameText.setFontSize(radius * 0.38);
    this.nameText.setFontFamily("Gagalin");
    let padding = radius * 0.0857;
    this.nameText.setPadding(padding, 0, padding, padding);
    this.nameText.style.setAlign("center");
    this.nameText.style.setColor("FFFFFF");
    this.nameText.style.setBackgroundColor("555455");
    this.add(this.nameText);
  }

  timerArc: Phaser.GameObjects.Arc;
  nameText: Phaser.GameObjects.Text;

  _timerPercentage: number = 0;

  get timerPercentage(): number {
    return this._timerPercentage;
  }

  set timerPercentage(newValue: number) {
    this._timerPercentage = newValue;
    this.timerArc.endAngle = -90 + 360 * newValue;
    if (newValue == 0) {
      this.nameText.setBackgroundColor("555455");
    } else {
      this.nameText.setBackgroundColor("0082FD");
    }
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
    this.setGeneratorState(GeneratorState.None);
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

export enum TextPosition {
  Top,
  Bottom,
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
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(0.875, 0.7);
        break;

      case SlotLayout.TopRight:
        this.textPosition = TextPosition.Top;
        this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-3.675, 0.7);
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
}

class GeneratorPosition {
  constructor(rotation: number, yOffsetFactor: number) {
    this.rotation = rotation;
    this.yOffsetFactor = yOffsetFactor;
  }
  rotation: number;
  yOffsetFactor: number;
}
