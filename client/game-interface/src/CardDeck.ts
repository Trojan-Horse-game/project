import "phaser";
import { CardSprite } from "./CardSprite";
import { ActionCard, Card, GeneratorCard } from "./Card";
import { GameScene } from "./GameScene";
import { GeneratorSlot } from "./GameNetworkDelegate";

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
    console.log("distributeCards", distributedCards);

    const dci = [...distributedCards].map((value, index) => {
      const tuple: [Card, number] = [value, index];
      return tuple;
    });
    playerSlot.cards
      .map(element => element.cardType)
      .forEach((card, index) => {
        console.log(index, "Card from player slot cards:", card);
        if (playerSlot.discardedIndices.indexOf(index) == -1) {
          /*
          console.log("This card is not present in discarded cards");
          console.log("Distributed copy is", dci);
          console.log("DCI start =======");
          for (const dcival of dci) {
            console.log(dcival[0]);
            console.log(dcival[1]);
          }
          console.log("DCI end========");
          */
          card.gameLogicIdx = dci.findIndex(value => {
            if (
              card instanceof GeneratorCard &&
              value[0] instanceof GeneratorCard
            ) {
              return (
                value[0].generator == card.generator &&
                value[0].kind == card.kind
              );
            } else if (
              card instanceof ActionCard &&
              value[0] instanceof ActionCard
            ) {
              return card.kind == value[0].kind;
            }
            return false;
          });
          console.log("Raw index is", card.gameLogicIdx);
          const toRemove = card.gameLogicIdx;
          card.gameLogicIdx = dci[card.gameLogicIdx][1];
          dci.splice(toRemove, 1);
          /*
          console.log(
            "Found matching index in distributedCards",
            card.gameLogicIdx
          );
            */
          // console.log("Now the copy is", dci);
        } else {
          // console.log("This card is present in discarded cards");
        }
      });

    distributedCards.forEach((card, idx) => {
      card.gameLogicIdx = idx;
    });

    distributedCards = distributedCards.slice(
      -playerSlot.discardedIndices.length
    );
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
