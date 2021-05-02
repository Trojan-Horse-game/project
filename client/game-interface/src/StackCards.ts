import "phaser";

export class StackCards extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, profilePictureRadius: number) {
    super(scene);

    let ratio = 0.7069;
    let height = profilePictureRadius * 3.5;
    let width = height * ratio;
    let margin = 10 * window.devicePixelRatio;
    let offsets = [-margin, 0, margin];
    for (let offset of offsets) {
      let card = scene.add.sprite(0, 0, "carte_verso");
      card.setDisplaySize(width, height);
      card.setOrigin(0.5, 1);
      card.setX(offset);
      card.setY(offset);
      this.add(card);
      this.cards.push(card);
    }
  }

  cards: Phaser.GameObjects.Sprite[] = [];
}
