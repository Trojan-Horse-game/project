import "phaser";
import Perso from "./perso";
import Card from "./card";
import Zone from "./Zone";
import Generateur from "./Generateur";

export class GameScene extends Phaser.Scene {
  nbPlayers: number;
  nbCartesTas: number;

  constructor() {
    super({
      key: "GameScene"
    });
  }
  init(/*params: any*/): void {
    this.nbPlayers = 6;
  }

  preload(): void {
    this.load.image("background", "assets/stars_background.jpg");
    this.load.image("carte_verso", "assets/carte_verso.png");

    this.load.image("foudre", "assets/foudre_log.png");
    this.load.image("air", "assets/air_log.png");
    this.load.image("goute", "assets/goute_log.png");
    this.load.image("radiation", "assets/radiation_log.png");
    this.load.image("super", "assets/super_log.png");

    this.load.image("fawkes", "assets/Fawkes.png");
    this.load.image("hutex", "assets/Hutex.png");
    this.load.image("robotec", "assets/Robotec.png");
    this.load.image("spectre", "assets/Spectre.png");
    this.load.image("totox", "assets/Totox.png");
    this.load.image("xmars", "assets/Xmars.png");
  }

  create(): void {
    const bg: Phaser.GameObjects.Image = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setScale(1.09);

    //button distribution cards
    const dealText: Phaser.GameObjects.Text = this.add
      .text(75, 300, ["DEAL CARDS"])
      .setFontSize(18)
      .setFontFamily("Trebuchet MS")
      .setColor("#00ffff")
      .setInteractive();
    dealText.on("pointerover", function () {
      dealText.setColor("#ff69b4");
    });
    dealText.on("pointerout", function () {
      dealText.setColor("#00ffff");
    });

    //distribution of the cards
    let dealCards = () => {
      for (let i = 0; i < 3; i++) {
        let playerCard: Card = new Card(this);
        playerCard.displayCard(475 + i * 180, 670, "carte_verso");
      }
    };
    dealText.on("pointerdown", function () {
      dealCards();
    });

    //moves of the cards from the hand
    this.input.on(
      "dragstart",
      function (pointer, gameObject) {
        gameObject.setTint(0xccffff);
        this.children.bringToTop(gameObject);
      },
      this
    );

    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
      gameObject.setTint(0xccffff);
      gameObject.setScale(0.01);
    });

    this.input.on("dragend", function (pointer, gameObject, dropped) {
      gameObject.setTint();
      gameObject.setScale(0.05);
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        gameObject.setScale(0.06);
      }
    });

    //pile of cards + dropzone + drawing limit of the dropzone
    let tas_zone = new Zone(this);
    let renderZone = tas_zone.renderZone("tas");
    let outline = tas_zone.renderOutline(renderZone);

    //highlight the pile of cards zone when dragenter
    this.input.on("dragenter", function (pointer, gameObject, dropZone) {
      if (dropZone.name == "tas") {
        outline.clear();
        outline.lineStyle(4, 0xff66ff);
        outline.strokeRect(
          renderZone.x - renderZone.input.hitArea.width / 2,
          renderZone.y - renderZone.input.hitArea.height / 2,
          renderZone.input.hitArea.width,
          renderZone.input.hitArea.height
        );
      }
    });
  }

  update(/*time: number*/): void {}
}
