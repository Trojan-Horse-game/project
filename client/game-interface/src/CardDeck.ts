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
    console.log("distributeCards:", distributedCards);
    const playerSlot = this.scene.playerSlot;
    distributedCards.forEach((value, index) => {
      value.gameLogicIdx = index;
    });

    const cardsArrayCopy = [...playerSlot.cards];
    const discardedCopy = [...playerSlot.discardedIndices];
    for (const index of discardedCopy.sort((a, b) => b - a)) {
      cardsArrayCopy.splice(index, 1);
    }
    console.log(
      "Removed discarded cards, array is now",
      cardsArrayCopy.map(value => value.cardType)
    );

    console.log("Removed discarded cards, array is now:");
    cardsArrayCopy.forEach((element, index) => {
      console.log(
        "[" + index + "]",
        element.cardType.kind,
        element.cardType.gameLogicIdx
      );
    });

    cardsArrayCopy.forEach((card, index) => {
      console.log("Rassigning index for", card.cardType);
      console.log("Old index was", card.cardType.gameLogicIdx);
      card.cardType.gameLogicIdx = index;
      console.log("New index is", card.cardType.gameLogicIdx);
    });

    distributedCards = distributedCards.slice(
      -playerSlot.discardedIndices.length
    );
    console.log("Sliced:", distributedCards);

    distributedCards.forEach((value: Card, index: number) => {
      const discardedIndex = playerSlot.discardedIndices[index];
      console.log(
        index,
        "In distributedCards with distributed card (value):",
        value
      );
      console.log("Discarded index is:", discardedIndex);
      const discardedCard = playerSlot.cards[discardedIndex];
      console.log("Discarded card is", discardedCard.cardType);
      const replacingDeckCard = this.deckCards.pop();
      playerSlot.cards[discardedIndex] = replacingDeckCard;
      const newPoint = playerSlot.getLocalPoint(
        replacingDeckCard.x + this.x,
        replacingDeckCard.y + this.y
      );
      const timeline = this.scene.tweens.createTimeline();

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
          replacingDeckCard.setInteractive();
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
