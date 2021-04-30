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
    for (let generator in GeneratorKind) {
      let generatorInfo = layoutInfo.generatorRotationBuilder(i);
      let basePivot = this.scene.add.container();
      let subPivot = this.scene.add.container();
      let circle = new Generator(
        scene,
        0.428 * playerCircleRadius,
        GeneratorKind[generator]
      );
      subPivot.setY(-1.642 * playerCircleRadius);
      circle.setY(generatorInfo.yOffsetFactor * playerCircleRadius);

      basePivot.rotation = generatorInfo.rotation;
      subPivot.rotation = -generatorInfo.rotation;
      subPivot.add(circle);
      basePivot.add(subPivot);
      this.add(basePivot);
      i++;
    }
  }
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
    let borderGraphics = this.scene.add.graphics();
    borderGraphics.lineStyle(innerStrokeWidth, 0x0);
    borderGraphics.strokeCircle(0, 0, radius - innerStrokeWidth);
    borderGraphics.lineStyle(strokeWidth, 0x565455);
    borderGraphics.strokeCircle(0, 0, radius);
    this.add(borderGraphics);
  }
}

class Generator extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    radius: number,
    generatorKind: GeneratorKind
  ) {
    super(scene);
    let strokeWidth = radius * 0.14;

    // Make and add generator image
    let generatorImage = this.scene.add.image(0, 0, generatorKind);
    let imageSize = (radius * 2 - strokeWidth) * 0.85;
    generatorImage.displayWidth = imageSize;
    generatorImage.displayHeight = imageSize;
    this.add(generatorImage);

    // Make border
    let borderGraphics = this.scene.add.graphics();
    borderGraphics.lineStyle(strokeWidth, 0x565455);
    borderGraphics.strokeCircle(0, 0, radius);
    this.add(borderGraphics);
  }
}

enum GeneratorKind {
  Joker = "super",
  Shield = "radiation",
  Water = "eau",
  Air = "air",
  Electricity = "foudre",
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
