import "phaser";
import { ProfilePicture, TextPosition } from "./ProfilePicture";
import { Generator, GeneratorKind } from "./Generator";

export class PlayerSlot extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    profilePictureRadius: number,
    name: string,
    texture: string
  ) {
    super(scene);

    // Cards
    let ratio = 0.7069;
    let height = profilePictureRadius * 3.5;
    let width = height * ratio;
    let margin = 10 * window.devicePixelRatio;
    let offsets = [-width - margin, 0, +width + margin];
    for (let offset of offsets) {
      let card = scene.add.sprite(0, 0, "carte_verso");
      card.setDisplaySize(width, height);
      card.setOrigin(0.5, 1);
      card.setX(offset);
      this.add(card);
      this.cards.push(card);
    }

    // Profile picture
    let profile = new ProfilePicture(
      scene,
      profilePictureRadius,
      TextPosition.Bottom,
      texture,
      name
    );
    profile.setPosition(-width * 2.25, -height * 0.46);
    this.add(profile);

    // Generators
    let generatorRadius = 0.58 * profilePictureRadius;
    let increment = generatorRadius * 2 * 1.4;
    let offset = -increment * 2;
    for (let generatorKind in GeneratorKind) {
      let generator = new Generator(
        scene,
        generatorRadius,
        GeneratorKind[generatorKind]
      );
      generator.setPosition(offset, -height * 1.3);
      offset += increment;
      this.add(generator);
    }
  }

  cards: Phaser.GameObjects.Sprite[] = [];
}
