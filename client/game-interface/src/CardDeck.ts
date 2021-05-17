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
    this.deckCards.push(card);
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
    distributedCards.forEach((value, index) => {
      value.gameLogicIdx = index;
    });

    const cardsArrayCopy = [...playerSlot.cards];
    const discardedCopy = [...playerSlot.discardedIndices];
    for (const index of discardedCopy.sort((a, b) => b - a)) {
      cardsArrayCopy.splice(index, 1);
    }

    cardsArrayCopy.sort(
      (lhs, rhs) => lhs.cardType.gameLogicIdx - rhs.cardType.gameLogicIdx
    );
    cardsArrayCopy.forEach((card, index) => {
      card.cardType.gameLogicIdx = index;
    });

    distributedCards = distributedCards.slice(
      -playerSlot.discardedIndices.length
    );

    console.log("Discarded indices", playerSlot.discardedIndices);

    distributedCards.forEach((value: Card, index: number) => {
      const discardedIndex = playerSlot.discardedIndices[index];
      const discardedCard = playerSlot.cards[discardedIndex];
      const replacingDeckCard = this.deckCards.pop();
      playerSlot.cards[discardedIndex] = replacingDeckCard;
      const newPoint = playerSlot.getLocalPoint(
        replacingDeckCard.x + this.x,
        replacingDeckCard.y + this.y
      );
      const timeline = this.scene.tweens.createTimeline();

      console.assert(
        replacingDeckCard != undefined,
        "Replacing deck card is undefined"
      );
      console.assert(
        discardedCard != undefined,
        "Discarded card is undefined, index is: " + discardedIndex
      );
      // Move card to replace
      timeline.add({
        targets: replacingDeckCard,
        delay: 250 * index,
        x: discardedCard.startX,
        y: discardedCard.startY,
        cardAngle: 0,
        duration: 600,
        ease: "power4",
        onStart: () => {
          this.remove(replacingDeckCard);
          playerSlot.add(replacingDeckCard);
          replacingDeckCard.setPosition(newPoint.x, newPoint.y);
        }
      });

      timeline.add({
        targets: replacingDeckCard,
        scaleX: 0,
        scaleY: 1.2,
        duration: 150,
        yoyo: true,
        onYoyo: () => {
          replacingDeckCard.cardType = value;
        },
        onComplete: () => {
          if (playerSlot.playerInteractive) {
            replacingDeckCard.setInteractive();
          }
          playerSlot.configureCardInteraction(replacingDeckCard);
        }
      });

      timeline.on("complete", () => {
        playerSlot.discardedIndices = [];
      });

      timeline.play();
    });
  }

  deckCards: CardSprite[] = [];
}
