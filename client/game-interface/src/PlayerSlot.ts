import "phaser";
import { ProfilePicture, TextPosition } from "./ProfilePicture";
import { Generator } from "./Generator";
import { GeneratorKind, GeneratorCard, GeneratorCardKind } from "./Card";
import { CardSprite } from "./CardSprite";

export class PlayerSlot extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    profilePictureRadius: number,
    name: string,
    texture: string
  ) {
    super(scene);

    // Cards
    const ratio = 0.7069;
    const height = profilePictureRadius * 3.5;
    const width = height * ratio;
    const margin = 10 * window.devicePixelRatio;
    const offsets = [-width - margin, 0, +width + margin];
    for (const offset of offsets) {
      // let card = scene.add.sprite(0, 0, "carte_verso");
      const card = new CardSprite(
        scene,
        new GeneratorCard(GeneratorCardKind.Medicine, GeneratorKind.Shield)
      );
      scene.input.setDraggable(card);
      card.setDisplaySize(width, height);
      card.setOrigin(0.5, 1);
      card.setX(offset);
      this.add(card);
      this.cards.push(card);
    }

    // Profile picture
    const profile = new ProfilePicture(
      scene,
      profilePictureRadius,
      TextPosition.Bottom,
      texture,
      name
    );
    profile.setPosition(-width * 2.25, -height * 0.46);
    this.add(profile);

    // Generators
    const generatorRadius = 0.58 * profilePictureRadius;
    const increment = generatorRadius * 2 * 1.4;
    let offset = -increment * 2;
    for (const generatorKind in GeneratorKind) {
      const generator = new Generator(
        scene,
        generatorRadius,
        GeneratorKind[generatorKind]
      );
      generator.setPosition(offset, -height * 1.3);
      offset += increment;
      this.add(generator);
    }
  }

  cards: CardSprite[] = [];
}
