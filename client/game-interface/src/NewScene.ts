import { Sleeping } from "matter";
import "phaser";
import { AUTO } from "phaser";
import { OpponentSlot, SlotLayout } from "./OpponentSlot";
import { PlayerSlot } from "./PlayerSlot";

export class ResponsiveScene extends Phaser.Scene {
  resize(width: number, height: number) {}
}
export class NewScene extends ResponsiveScene {
  constructor(players: Player[], playerIndex: number) {
    super({});
    this.players = players;
    this.playerIndex = 0;
  }

  players: Player[];
  playerIndex: number;

  positions: Position[];

  playerSlot: PlayerSlot;
  opponentsSlots: OpponentSlot[] = [];
  background: Phaser.GameObjects.Image

  preload() {
    this.load.image("carte_verso", "src/assets/carte_verso.png");
    this.load.image("bground", "src/assets/bground.gif");
    this.load.image("winner", "src/assets/winner.gif");
    this.load.image("game_over", "src/assets/game_over.gif");

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

  create() {
    let noms = ["Youness", "Aghilas", "Siham", "Isa", "Nicolas", "Walid"];
    let textures = [
      "fawkes_tete",
      "hutex_tete",
      "robotec_tete",
      "spectre_tete",
      "totox_tete",
      "xmars_tete",
    ];

    /*let windowWidth = window.innerWidth;
let widnowHeight = window.innerHeight;
 let bg =this.add.image(windowWidth / 2, widnowHeight / 2, 'winner');
 this.bg.setDisplaySize(windowWidth, widnowHeight);*/
this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bground')
let scaleX = this.cameras.main.width / this.background.width
let scaleY = this.cameras.main.height / this.background.height
let scale = Math.max(scaleX, scaleY)
this.background.setScale(scale).setScrollFactor(0)


    let players: Player[] = [];
    for (let i = 0; i < 6; i++) {
      players.push(new Player(noms[i], textures[i]));
    }

    this.updatePlayers(players, 0);

    let profileRadius = 55 * window.devicePixelRatio;
    this.playerSlot = new PlayerSlot(
      this,
      profileRadius,
      this.players[this.playerIndex].name,
      this.players[this.playerIndex].specie
    );
    this.add.existing(this.playerSlot);

    let width = this.cameras.main.width;
    let height = this.cameras.main.height;
    this.resize(width, height);
  }

  resize(width: number, height: number) {
    this.updateSlotsPositions(width, height);
    for (let i = 0; i < this.opponentsSlots.length; i++) {
      let position = this.playerPosition(i);
      this.opponentsSlots[i].setPosition(position.x, position.y);
    }
    this.playerSlot.setPosition(
      width / 2,
      height - 15 * window.devicePixelRatio
    );
  }

  updatePlayers(newValue: Player[], playerIndex: number) {
    this.players = newValue;
    this.playerIndex = playerIndex;
    this.createPlayers();
  }

  appendPlayer(newPlayer: Player) {}

  removePlayer(removedPlayerIndex: number) {
    if (removedPlayerIndex < this.playerIndex) {
      this.playerIndex--;
    }
  }

  createPlayers() {
    // Remove any previously existing opponent slot
    for (let opponentSlot of this.opponentsSlots) {
      opponentSlot.destroy();
    }
    this.opponentsSlots = [];

    // Create opponents
    let index = (this.playerIndex + 1) % this.players.length;
    let opponentIndex = 0;
    while (index != this.playerIndex) {
      let opponent = this.players[index];
      let opponentSlot = new OpponentSlot(
        this,
        55 * window.devicePixelRatio,
        this.slotLayoutForOpponent(opponentIndex),
        opponent.name,
        opponent.specie
      );

      this.opponentsSlots.push(opponentSlot);
      this.add.existing(opponentSlot);
      index = (index + 1) % this.players.length;
      opponentIndex++;
    }
  }

  slotLayoutForOpponent(opponentIndex: number): SlotLayout {
    return NewScene.slotsLayouts[this.players.length][opponentIndex];
  }

  updateSlotsPositions(width: number, height: number) {
    let horizontalDistance = 100 * window.devicePixelRatio;
    let verticalDistance = 115 * window.devicePixelRatio;
    let heightDiff = 325 * window.devicePixelRatio;
    let minHeight = 400 * window.devicePixelRatio;
    this.positions = [
      {
        x: horizontalDistance,
        y: Math.max(height - heightDiff, minHeight),
      },
      { x: horizontalDistance, y: verticalDistance },
      { x: width / 2, y: verticalDistance },
      { x: width - horizontalDistance, y: verticalDistance },
      {
        x: width - horizontalDistance,
        y: Math.max(height - heightDiff, minHeight),
      },
    ];
  }

  playerPosition(playerIndex: number): { x: number; y: number } {
    let index = NewScene.slotsMappings[this.players.length][playerIndex];
    return this.positions[index];
  }

  static slotsMappings = {
    2: [2],
    3: [1, 3],
    4: [0, 2, 4],
    5: [0, 1, 3, 4],
    6: [0, 1, 2, 3, 4],
  };

  static slotsLayouts = {
    2: [SlotLayout.Middle],
    3: [SlotLayout.TopLeft, SlotLayout.TopRight],
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

export class Player {
  constructor(name: string, specie: string) {
    this.name = name;
    this.specie = specie;
  }
  name: string;
  specie: string;
}
