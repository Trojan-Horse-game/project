export default class Generateur {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }
  gen_render(x: number, y: number, sprite: string) {
    return this.scene.add
      .image(x, y, sprite)
      .setScale(0.07, 0.07)
      .setInteractive();
  }

  gen_renderZone(
    x: number,
    y: number,
    width: number,
    height: number,
    name: string
  ): Phaser.GameObjects.Zone {
    return this.scene.add
      .zone(x, y, width, height)
      .setCircleDropZone(35)
      .setName(name)
      .setData({ state: "inactif" });
  }

  gen_renderOutline(generateurDropZone: Phaser.GameObjects.Zone) {
    return this.scene.add
      .graphics()
      .lineStyle(4, 0x999999)
      .strokeCircle(
        generateurDropZone.x,
        generateurDropZone.y,
        generateurDropZone.input.hitArea.radius
      );
  }
}
