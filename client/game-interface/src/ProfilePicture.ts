/* eslint-disable @typescript-eslint/no-use-before-define */
import "phaser";

export class ProfilePicture extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    radius: number,
    textPosition: TextPosition,
    pictureName: string,
    playerName: string
  ) {
    super(scene);
    const strokeWidth = radius * 0.15;

    // The width of the black inner stroke that separates the
    // character picture from the main border
    const innerStrokeWidth = strokeWidth / 1.7;

    // Create and add image
    const image = this.scene.add.image(0, 0, pictureName);
    const imageSize = radius * 2 - strokeWidth;
    image.displayWidth = imageSize;
    image.displayHeight = imageSize;
    this.add(image);

    // Create borders
    const innerCircle = this.scene.add.circle(0, 0, radius - innerStrokeWidth);
    innerCircle.setStrokeStyle(innerStrokeWidth, 0x0, 1);
    this.add(innerCircle);

    const outerCircle = this.scene.add.circle(0, 0, radius);
    outerCircle.setStrokeStyle(strokeWidth, 0x565455, 1);
    this.add(outerCircle);

    this.timerArc = this.scene.add.arc(0, 0, radius, -90, -90);
    this.timerArc.closePath = false;
    this.timerArc.setStrokeStyle(strokeWidth, 0x0082fd, 1);
    this.add(this.timerArc);

    // Create text
    this.nameText = this.scene.add.text(0, 0, playerName.toUpperCase());
    this.nameText.setOrigin(0.5, textPosition == TextPosition.Bottom ? 0 : 1);
    const yTextPosFactor = textPosition == TextPosition.Top ? -1.15 : 1.15;
    this.nameText.setY(yTextPosFactor * radius);
    this.nameText.setFontSize(radius * 0.38);
    this.nameText.setFontFamily("Gagalin");
    const padding = radius * 0.0857;
    this.nameText.setPadding(padding, 0, padding, padding);
    this.nameText.style.setAlign("center");
    this.nameText.style.setColor("#FFFFFF");
    this.nameText.style.setBackgroundColor("#555455");
    this.add(this.nameText);
  }

  timerArc: Phaser.GameObjects.Arc;
  nameText: Phaser.GameObjects.Text;

  _timerPercentage = 0;

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

export enum TextPosition {
  Top,
  Bottom
}
