export default class Card {
  scene: Phaser.Scene;
  constructor(scene) {
    this.scene = scene;
  }

  displayCard(x: number, y: number, sprite: string): Phaser.GameObjects.Image {
    const card: Phaser.GameObjects.Image = this.scene.add
      .image(x, y, sprite)
      .setScale(0.06, 0.06)
      .setInteractive();
    this.scene.input.setDraggable(card);
    return card;
  }
}
