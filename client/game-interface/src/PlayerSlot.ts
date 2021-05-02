import "phaser";
import { ProfilePicture, TextPosition } from "./ProfilePicture";
import { Generator, GeneratorState } from "./Generator";
import { StackCards } from "./StackCards";
import { OpponentSlot } from "./OpponentSlot";
import {
  GeneratorKind,
  Card,
  ActionCard,
  ActionCardKind,
  GeneratorCard,
  GeneratorCardKind
} from "./Card";
import { CardSprite } from "./CardSprite";

function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x2, 2) + Math.pow(y2 - y1, 2));
}

export class PlayerSlot extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    profilePictureRadius: number,
    name: string,
    texture: string,
    stackPosition: number
  ) {
    super(scene);

    // Cards
    let ratio = 0.7069;
    let height = profilePictureRadius * 3.5;
    let width = height * ratio;
    let margin = 10 * window.devicePixelRatio;
    let offsets = [-width - margin, 0, +width + margin];
    for (let offset of offsets) {
      // let card = scene.add.sprite(0, 0, "carte_verso");
      let card = new CardSprite(
        scene,
        new GeneratorCard(GeneratorCardKind.Medicine, GeneratorKind.Shield)
      );
      card.setDepth(100);
      card.setInteractive();
      scene.input.setDraggable(card);
      let originX = 0;
      let originY = 0;
      let originScale = 0;
      scene.input.on(
        "drag",
        (
          pointer,
          gameObject: Phaser.GameObjects.Sprite,
          dragX: number,
          dragY: number
        ) => {
          gameObject.setPosition(dragX, dragY);
          let distance = dist(originX, originY, dragX, dragY);
          gameObject.setScale(
            Math.max(originScale - Math.min(distance / 800, 1), 0.35)
          );
        }
      );

      scene.input.on(
        "dragstart",
        (
          pointer,
          gameObject: Phaser.GameObjects.Sprite,
          dragX: number,
          dragY: number
        ) => {
          console.log("scale", gameObject.scale);
          originX = gameObject.x;
          originY = gameObject.y;
          originScale = gameObject.scale;
        }
      );

      scene.input.on(
        "dragend",
        (
          pointer,
          gameObject: Phaser.GameObjects.Sprite,
          dragX: number,
          dragY: number
        ) => {
          console.log(originX);
          var tween = scene.tweens.add({
            targets: gameObject,
            x: originX,
            y: originY,
            scale: originScale,
            duration: 400,
            ease: "power4"
          });
        }
      );

      card.setDisplaySize(width, height);
      card.setOrigin(0.5, 1);

      if (OpponentSlot.length % 2 == 1) card.setY(-stackPosition / 2.5);
      else card.setY(-stackPosition / 2);

      scene.tweens.add({
        targets: card,
        x: offset,
        y: 0,
        duration: 4000,
        ease: "Power2",
        delay: 500
      });

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
