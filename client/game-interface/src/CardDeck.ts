import "phaser";
import { CardSprite } from "./CardSprite";
import { Card } from "./Card";
import { GameScene } from "./GameScene";

export class CardDeck extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, width: number, height: number) {
    super(scene);
    this.setSize(width, height);
    this.setInteractive();
    this.input.dropZone = true;
  }

  addCard(card: CardSprite) {
    this.cards.push(card);
    card.disableInteractive();
    card.cardAngle = (Math.random() - 0.5) * 10;
    card.setPosition(0, this.height / 2);
    this.add(card);
  }

  distributeCards(distributedCards: Card[]) {
    if (!(this.scene instanceof GameScene)) {
      return;
    }
    const playerSlot = this.scene.playerSlot;
    console.log("Before filter", distributedCards);
    distributedCards = distributedCards.filter((element, index) => {
      return playerSlot.discardedIndices.indexOf(index) != -1;
    });
    console.log("After filter", distributedCards);
    distributedCards.forEach((value: Card, index: number) => {
      const discardedIndex = playerSlot.discardedIndices[index];
      const discardedCard = playerSlot.cards[discardedIndex];
      const replacingCard = this.cards.pop();
      playerSlot.cards[discardedIndex] = replacingCard;
      const newPoint = playerSlot.getLocalPoint(
        replacingCard.x + this.x,
        replacingCard.y + this.y
      );
      const timeline = this.scene.tweens.createTimeline();

      // Move card to replace
      timeline.add({
        targets: replacingCard,
        delay: 250 * index,
        x: discardedCard.startX,
        y: discardedCard.startY,
        cardAngle: 0,
        duration: 600,
        ease: "power4",
        onStart: () => {
          this.remove(replacingCard);
          playerSlot.add(replacingCard);
          replacingCard.setPosition(newPoint.x, newPoint.y);
        }
      });

      timeline.add({
        targets: replacingCard,
        scaleX: 0,
        scaleY: 1.2,
        duration: 150,
        yoyo: true,
        onYoyo: () => {
          replacingCard.cardType = value;
        },
        onComplete: () => {
          replacingCard.setInteractive();
          playerSlot.configureCardInteraction(replacingCard);
        }
      });

      timeline.on("complete", () => {
        playerSlot.discardedIndices = [];
      });

      timeline.play();
    });
  }

  cards: CardSprite[] = [];
}
