import "phaser";
import { OpponentSlot, SlotLayout } from "./OpponentSlot";
import { PlayerSlot } from "./PlayerSlot";

export class ResponsiveScene extends Phaser.Scene {
  resize(width: number, height: number) {}
}
export class NewScene extends ResponsiveScene {
  constructor() {
    super({});
  }

  preload() {
    this.load.image("carte_verso", "src/assets/carte_verso.png");

    this.load.image("fawkes_tete", "src/assets/Fawkes_tete.png");
    this.load.image("hutex_tete", "src/assets/Hutex_tete.png");
    this.load.image("robotec_tete", "src/assets/Robotec_tete.png");
    this.load.image("spectre_tete", "src/assets/Spectre_tete.png");
    this.load.image("totox_tete", "src/assets/Totox_tete.png");
    this.load.image("xmars_tete", "src/assets/Xmars_tete.png");

    this.load.image("foudre", "src/assets/foudre_log.png");
    this.load.image("air", "src/assets/air_log.png");
    this.load.image("eau", "src/assets/goute_log.png");
    this.load.image("radiation", "src/assets/radiation_log.png");
    this.load.image("super", "src/assets/super_log.png");
    this.load.image("super_sign", "src/assets/super.png");
  }

  player: PlayerSlot;
  opponents: OpponentSlot[] = [];
  playerCount = 6;

  resize(width: number, height: number) {
    this.updatePositions(width, height);
    for (let i = 0; i < this.playerCount - 1; i++) {
      let position = this.playerPosition(i);
      this.opponents[i].setPosition(position.x, position.y);
    }
    this.player.setPosition(width / 2, height - 15 * window.devicePixelRatio);
  }

  playerPosition(playerIndex: number): { x: number; y: number } {
    let index = NewScene.slotsMappings[this.playerCount][playerIndex];
    return this.positions[index];
  }

  create() {
    let noms = ["Aghilas", "Siham", "Isa", "Nicolas", "Walid"];
    let textures = [
      "fawkes_tete",
      "hutex_tete",
      "robotec_tete",
      "spectre_tete",
      "totox_tete",
      "xmars_tete",
    ];

    let profileRadius = 55 * window.devicePixelRatio;
    this.player = new PlayerSlot(this, profileRadius, "Youness", "xmars_tete");
    this.add.existing(this.player);

    this.opponents = [];

    for (let i = 0; i < this.playerCount - 1; i++) {
      let player = new OpponentSlot(
        this,
        profileRadius,
        NewScene.slotsLayouts[this.playerCount][i],
        noms[i],
        textures[i]
      );
      this.add.existing(player);
      this.opponents.push(player);
    }

    let width = this.cameras.main.width;
    let height = this.cameras.main.height;
    this.resize(width, height);
  }

  positions: Position[];

  updatePositions(width: number, height: number) {
    let horizontalDistance = 100 * window.devicePixelRatio;
    let verticalDistance = 115 * window.devicePixelRatio;
    let heightDiff = 325 * window.devicePixelRatio;
    let minHeight = 400 * window.devicePixelRatio;
    this.positions = [
      { x: horizontalDistance, y: Math.max(height - heightDiff, minHeight) },
      { x: horizontalDistance, y: verticalDistance },
      { x: width / 2, y: verticalDistance },
      { x: width - horizontalDistance, y: verticalDistance },
      {
        x: width - horizontalDistance,
        y: Math.max(height - heightDiff, minHeight),
      },
    ];
  }

  static slotsMappings = {
    2: [2],
    3: [0, 4],
    4: [0, 2, 4],
    5: [0, 1, 3, 4],
    6: [0, 1, 2, 3, 4],
  };

  static slotsLayouts = {
    2: [SlotLayout.Middle],
    3: [SlotLayout.BottomLeft, SlotLayout.BottomRight],
    4: [SlotLayout.BottomLeft, SlotLayout.Middle, SlotLayout.BottomRight],
    5: [
      SlotLayout.BottomLeft,
      SlotLayout.TopLeft,
      SlotLayout.TopRight,
      SlotLayout.BottomRight,
    ],
    6: [
      SlotLayout.BottomLeft,
      SlotLayout.TopLeft,
      SlotLayout.Middle,
      SlotLayout.TopRight,
      SlotLayout.BottomRight,
    ],
  };
}

type Position = { x: number; y: number };
