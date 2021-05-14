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
        new GeneratorCard(GeneratorCardKind.Medicine, GeneratorKind.Joker),
        width,
        height
      );
      this.configureCardInteraction(card);
      card.setX(offset);
      card.setAlpha(0);
      card.startX = card.x;
      card.startY = card.y;
      card.startWidth = card.displayWidth;
      card.startHeight = card.displayHeight;
      this.add(card);
      this.cards.push(card);
      this.playerInteractive = false;
    }
    this.discardedIndices = [0, 1, 2];

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
    let i = 0;
    for (const generatorKind in GeneratorKind) {
      const generator = new Generator(
        scene,
        generatorRadius,
        GeneratorKind[generatorKind],
        true,
        i
      );
      generator.setPosition(offset, -height * 1.3);
      generator.setGeneratorState(GeneratorState.Enabled);
      offset += increment;
      this.add(generator);
      i++;
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
        PlayerSlot.animateDropBack(this.scene, selectedCard);
      }
    });

    card.on(
      "drag",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        const xTranslation = pointer.x - pointer.downX;
        const yTranslation = pointer.y - pointer.downY;
        const distance = Math.sqrt(
          Math.pow(xTranslation, 2) + Math.pow(yTranslation, 2)
        );
        // let minThreshold = 150 * window.devicePixelRatio;
        const minThreshold = 0;
        let proportion = Math.min(
          1,
          Math.max(0, distance - minThreshold) / 500
        );
        proportion = Math.min(proportion, 0.95);
        for (const otherCard of this.otherSelected) {
          const baseXPosition = otherCard.startX + xTranslation;
          const xPosition =
            (1 - proportion) * baseXPosition + proportion * card.x;
          otherCard.setPosition(xPosition, card.y);
          otherCard.setScale(card.scale);
        }
      }
    );
  }

  static animateDropBack(scene: Phaser.Scene, selectedCard: CardSprite) {
    scene.input.setDraggable(selectedCard, false);
    scene.tweens
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
        scene.input.setDraggable(selectedCard);
      });
  }
}
