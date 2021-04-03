import "phaser";

export default class Zone {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  renderZone(name: string): Phaser.GameObjects.Zone {
    return this.scene.add
      .zone(640, 390, 150, 150)
      .setRectangleDropZone(150, 150)
      .setData({ cards: 0 })
      .setName(name);
  }

  renderOutline(dropZone: Phaser.GameObjects.Zone) {
    return this.scene.add
      .graphics()
      .lineStyle(4, 0xffffcc)
      .strokeRect(
        dropZone.x - dropZone.input.hitArea.width / 2,
        dropZone.y - dropZone.input.hitArea.height / 2,
        dropZone.input.hitArea.width,
        dropZone.input.hitArea.height
      );
  }
}
