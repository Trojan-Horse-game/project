import "phaser";
import { ProfilePicture, TextPosition } from "./ProfilePicture";
import { Generator, GeneratorState } from "./Generator";
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
    const margin = 20 * window.devicePixelRatio;
    const offsets = [-width - margin, 0, +width + margin];
    for (const offset of offsets) {
      const card = new CardSprite(
        scene,
        new GeneratorCard(GeneratorCardKind.Virus, GeneratorKind.Joker),
        width,
        height
      );
      this.configureCardInteraction(card);
      card.setX(offset);
      this.add(card);
      this.cards.push(card);
      this.playerInteractive = false;
    }

    // Profile picture
    this.profilePicture = new ProfilePicture(
      scene,
      profilePictureRadius,
      TextPosition.Bottom,
      texture,
      name
    );
    this.profilePicture.setPosition(-width * 2.25, -height * 0.46);
    this.add(this.profilePicture);

    // Generators
    const generatorRadius = 0.58 * profilePictureRadius;
    const increment = generatorRadius * 2 * 1.4;
    let offset = -increment * 2;
    for (const generatorKind in GeneratorKind) {
      const generator = new Generator(
        scene,
        generatorRadius,
        GeneratorKind[generatorKind],
        true
      );
      generator.setPosition(offset, -height * 1.3);
      generator.setGeneratorState(GeneratorState.Enabled);
      offset += increment;
      this.add(generator);
    }
  }

  profilePicture: ProfilePicture;
  private otherSelected: CardSprite[] = [];
  selectedCards: CardSprite[] = [];
  cards: CardSprite[] = [];
  discardedIndices: number[] = [];
  private _playerInteractive: boolean;
  get playerInteractive(): boolean {
    return this._playerInteractive;
  }
  set playerInteractive(newValue) {
    this._playerInteractive = newValue;
    for (const card of this.cards) {
      if (this.playerInteractive) {
        card.setInteractive();
      } else {
        card.disableInteractive();
      }
    }
  }

  configureCardInteraction(card: CardSprite) {
    card.selectedCallback = (selected: boolean) => {
      if (selected) {
        this.selectedCards.push(card);
      } else {
        const index = this.selectedCards.indexOf(card);
        this.selectedCards.splice(index, 1);
      }
    };

    card.on("dragstart", () => {
      this.otherSelected = this.selectedCards.filter(value => {
        return value !== card;
      });
      for (const otherCard of this.otherSelected) {
        otherCard.startX = otherCard.x;
        otherCard.startY = otherCard.y;
      }
    });

    card.on("dragend", () => {
      for (const selectedCard of this.selectedCards) {
        if (selectedCard.dropped) {
          continue;
        }
        this.scene.input.setDraggable(selectedCard, false);
        this.scene.tweens
          .add({
            targets: selectedCard,
            x: selectedCard.startX,
            y: selectedCard.startY,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: "power4"
          })
          .on("complete", () => {
            this.scene.input.setDraggable(selectedCard);
          });
      }
    });

    card.on(
      "drag",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        let xTranslation = pointer.x - pointer.downX;
        let yTranslation = pointer.y - pointer.downY;
        let distance = Math.sqrt(
          Math.pow(xTranslation, 2) + Math.pow(yTranslation, 2)
        );
        // let minThreshold = 150 * window.devicePixelRatio;
        let minThreshold = 0;
        let proportion = Math.min(
          1,
          Math.max(0, distance - minThreshold) / 500
        );
        proportion = Math.min(proportion, 0.95);
        for (const otherCard of this.otherSelected) {
          let baseXPosition = otherCard.startX + xTranslation;
          let xPosition =
            (1 - proportion) * baseXPosition + proportion * card.x;
          otherCard.setPosition(xPosition, card.y);
          otherCard.setScale(card.scale);
        }
      }
    );
  }
}
