import "phaser";
import Perso from "./perso";
import Card from "./card";
import Zone from "./Zone";
import Generateur from "./Generateur";

export class GameScene extends Phaser.Scene {
  nbPlayers: number;
  nbCartesTas: number;
  playerPosition: number[][];
  players: Perso[];
  namePlayers: string[];
  generators: Generateur[][];

  constructor() {
    super({
      key: "GameScene",
    });
  }
  init(/*params: any*/): void {
    this.nbPlayers = 6;
    this.playerPosition = [];
    this.players = [];
    this.namePlayers = [];
    this.namePlayers[0] = "YOUNESS";
    this.namePlayers[1] = "AGHILAS";
    this.namePlayers[2] = "SIHAM";
    this.namePlayers[3] = "ISA";
    this.namePlayers[4] = "NICOLAS";
    this.namePlayers[5] = "HAKIM";
    this.generators = [];
  }

  preload(): void {
    this.load.image("background", "src/assets/stars_background.jpg");
    this.load.image("carte_verso", "src/assets/carte_verso.png");
    this.load.image("fawkes", "src/assets/Fawkes.png");
    this.load.image("xmars", "src/assets/Xmars.png");
    this.load.image("hutex", "src/assets/Hutex.png");
    this.load.image("robotec", "src/assets/Robotec.png");
    this.load.image("spectre", "src/assets/Spectre.png");
    this.load.image("totox", "src/assets/Totox.png");

    this.load.image("foudre", "src/assets/foudre_log.png");
    this.load.image("air", "src/assets/air_log.png");
    this.load.image("eau", "src/assets/goute_log.png");
    this.load.image("radiation", "src/assets/radiation_log.png");
    this.load.image("super", "src/assets/super_log.png");
  }

  create(): void {
    //to see what key was pressed
    //this.cursorKeys = this.input.keyboard.createCursorKeys();

    let { width, height } = this.sys.game.canvas;
    //Here we compute the worst case, i.e 6 players are in the game
    //and we will choose position according to the numbers of players
    //the index is 0 for me, and 1,2,3,4,5 for the others, in clockwise direction
    let players = 3; //nbPlayers deux trucz
    let perso = new Perso(this);
    this.playerPosition = perso.computePosition(players, width, height);

    const bg = this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setScale(1.09);

    //button distribution cards
    let dealText = this.add
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
        let playerCard = new Card(this);
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
      if(dropZone.name == "tas") {
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

    //Todo: ajouter éventuellement une drop zone sur les personnages
    //affichage des personnages + leur noms
    for (let i = 0; i < this.nbPlayers; i++) {
      this.players[i] = new Perso(this);
    }

    this.players[0].displayPlayers(
      this.players,
      this.playerPosition,
      0,
      "xmars",
      this.namePlayers
    );
    this.players[1].displayPlayers(
      this.players,
      this.playerPosition,
      1,
      "totox",
      this.namePlayers
    );
    this.players[2].displayPlayers(
      this.players,
      this.playerPosition,
      2,
      "fawkes",
      this.namePlayers
    );
    this.players[3].displayPlayers(
      this.players,
      this.playerPosition,
      3,
      "robotec",
      this.namePlayers
    );
    this.players[4].displayPlayers(
      this.players,
      this.playerPosition,
      4,
      "hutex",
      this.namePlayers
    );
    this.players[5].displayPlayers(
      this.players,
      this.playerPosition,
      5,
      "spectre",
      this.namePlayers
    );
    /*
        indice 0 : foudre
        indice 1 : air
        indice 2 : goute
        indice 3 : radiation
        indice 4 : super
*/
    for (let i = 0; i < this.nbPlayers; i++) {
      this.generators.push([]);
      for (let j = 0; j < 5; j++) {
        this.generators[i][j] = new Generateur(this);
      }
    }

    //Player 0 (main player)
    let x = this.playerPosition[0][0];
    let y = this.playerPosition[0][1];
    this.generators[0][0].displayGenerator(
      x + 170,
      y - 155,
      "foudre",
      "foudre_0"
    );
    this.generators[0][1].displayGenerator(x + 250, y - 155, "air", "air_0");
    this.generators[0][2].displayGenerator(x + 330, y - 155, "eau", "eau_0");
    this.generators[0][3].displayGenerator(
      x + 410,
      y - 155,
      "radiation",
      "radiation_0"
    );
    this.generators[0][4].displayGenerator(
      x + 490,
      y - 155,
      "super",
      "super_0"
    );

    //player 1
    x = this.playerPosition[1][0];
    y = this.playerPosition[1][1];
    this.generators[1][0].displayGenerator(
      x + 95,
      y - 80,
      "foudre",
      "foudre_1"
    );
    this.generators[1][1].displayGenerator(x + 110, y, "air", "air_1");
    this.generators[1][2].displayGenerator(x + 95, y + 75, "eau", "eau_1");
    this.generators[1][3].displayGenerator(
      x + 25,
      y + 110,
      "radiation",
      "radiation_1"
    );
    this.generators[1][4].displayGenerator(x - 50, y + 110, "super", "super_1");

    //player 2
    x = this.playerPosition[2][0];
    y = this.playerPosition[2][1];
    this.generators[2][0].displayGenerator(
      x + 95,
      y - 80,
      "foudre",
      "foudre_2"
    );
    this.generators[2][1].displayGenerator(x + 110, y, "air", "air_2");
    this.generators[2][2].displayGenerator(x + 95, y + 75, "eau", "eau_2");
    this.generators[2][3].displayGenerator(
      x + 25,
      y + 110,
      "radiation",
      "radiation_2"
    );
    this.generators[2][4].displayGenerator(x - 50, y + 110, "super", "super_2");

    //player 3
    x = this.playerPosition[3][0];
    y = this.playerPosition[3][1];
    this.generators[3][0].displayGenerator(
      x - 110,
      y - 30,
      "foudre",
      "foudre_3"
    );
    this.generators[3][1].displayGenerator(x - 100, y + 65, "air", "air_3");
    this.generators[3][2].displayGenerator(x, y + 110, "eau", "eau_3");
    this.generators[3][3].displayGenerator(
      x + 100,
      y + 65,
      "radiation",
      "radiation_3"
    );
    this.generators[3][4].displayGenerator(x + 110, y - 30, "super", "super_3");

    //player 4
    x = this.playerPosition[4][0];
    y = this.playerPosition[4][1];
    this.generators[4][0].displayGenerator(
      x - 105,
      y - 60,
      "foudre",
      "foudre_4"
    );
    this.generators[4][1].displayGenerator(x - 120, y + 15, "air", "air_4");
    this.generators[4][2].displayGenerator(x - 110, y + 90, "eau", "eau_4");
    this.generators[4][3].displayGenerator(
      x - 30,
      y + 110,
      "radiation",
      "radiation_4"
    );
    this.generators[4][4].displayGenerator(x + 50, y + 110, "super", "super_4");

    //player 5
    x = this.playerPosition[5][0];
    y = this.playerPosition[5][1];
    this.generators[5][0].displayGenerator(
      x - 95,
      y - 80,
      "foudre",
      "foudre_5"
    );
    this.generators[5][1].displayGenerator(x - 110, y, "air", "air_5");
    this.generators[5][2].displayGenerator(x - 100, y + 75, "eau", "eau_5");
    this.generators[5][3].displayGenerator(
      x - 30,
      y + 115,
      "radiation",
      "radiation_5"
    );
    this.generators[5][4].displayGenerator(x + 50, y + 110, "super", "super_5");

    /*
        let foudre_1 = new Generateur(this);
        let air_1 = new Generateur(this);
        let goute_1 = new Generateur(this);
        let radiation_1 = new Generateur(this);
        let super_1 = new Generateur(this);

        foudre_1.gen_render(195, 40, 'foudre');
        let foudre_renZ_1 = foudre_1.gen_renderZone(195, 40, "foudre_1");
        let foudre_renO_1 = foudre_1.gen_renderOutline(foudre_renZ_1);

        air_1.gen_render(225,115, 'air');
        let air_renZ_1 = air_1.gen_renderZone(225, 115, "air_1");
        let air_renO_1 = air_1.gen_renderOutline(air_renZ_1);

        goute_1.gen_render(200, 185, 'goute');
        let goute_renZ_1 = goute_1.gen_renderZone(200, 185, "goute_1");
        let goute_renO_1 = goute_1.gen_renderOutline(goute_renZ_1);

        radiation_1.gen_render(150, 245, 'radiation');
        let rad_renZ_1 = radiation_1.gen_renderZone(150, 245, "radiation_1");
        let rad_renO_1 = radiation_1.gen_renderOutline(rad_renZ_1);

        super_1.gen_render(70, 245, 'super');
        let super_renZ_1 = super_1.gen_renderZone(70, 245, "super_1");
        let super_renO_1 = super_1.gen_renderOutline(super_renZ_1);*/
  }

  update(/*time: number*/): void {}
}
