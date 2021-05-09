import "phaser";

export class ActionDropZone extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, radius: number) {
    super(scene);
    this.circle = scene.add.sprite(0, 0, "dropzone_circle");
    this.circle.setDisplaySize(radius * 2, radius * 2);
    this.add(this.circle);
    this.setAlpha(0);

    this.setSize(radius * 2, radius * 2);
    this.setInteractive();
    this.input.dropZone = true;

    this.text = scene.add.sprite(0, 0, "utiliser");
    this.text.setPosition(0, radius + 20 * window.devicePixelRatio);
    this.text.setScale(0.53);
    this.add(this.text);
  }

  circle: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Sprite;
}
