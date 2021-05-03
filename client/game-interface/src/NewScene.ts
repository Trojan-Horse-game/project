import "phaser";
import { OpponentSlot, SlotLayout } from "./OpponentSlot";
import { PlayerSlot } from "./PlayerSlot";
import { Card, ActionCardKind, GeneratorKind, GeneratorCardKind } from "./Card";

export class ResponsiveScene extends Phaser.Scene {
  resize(width: number, height: number) {
    console.error("Method must be overriden")
  }
}
export class NewScene extends ResponsiveScene {
  constructor(players: Player[], playerIndex: number) {
    super({});
    this.players = players;
    this.playerIndex = playerIndex;
  }

  players: Player[];
  playerIndex: number;

  positions: Position[];

  playerSlot: PlayerSlot;
  opponentsSlots: OpponentSlot[] = [];

  preload() {
    this.load.image("carte_verso", "src/assets/carte_verso.png");

    this.load.image("fawkes_tete", "src/assets/Fawkes_tete.png");
    this.load.image("hutex_tete", "src/assets/Hutex_tete.png");
    this.load.image("robotec_tete", "src/assets/Robotec_tete.png");
    this.load.image("spectre_tete", "src/assets/Spectre_tete.png");
    this.load.image("totox_tete", "src/assets/Totox_tete.png");
    this.load.image("xmars_tete", "src/assets/Xmars_tete.png");

    this.load.image("electricity", "src/assets/foudre_log.png");
    this.load.image("air", "src/assets/air_log.png");
    this.load.image("water", "src/assets/goute_log.png");
    this.load.image("shield", "src/assets/radiation_log.png");
    this.load.image("joker", "src/assets/super_log.png");
    this.load.image("super_sign", "src/assets/super.png");

    // Action cards assets
    for (let actionName in ActionCardKind) {
      this.load.image(
        ActionCardKind[actionName],
        "src/assets/" + ActionCardKind[actionName] + ".jpg"
      );
    }

    // Generator card assets
    let suffixes = ["G", "P", "V"];
    for (let suffix of suffixes) {
      for (let generatorName in GeneratorKind) {
        this.load.image(
          GeneratorKind[generatorName] + "_" + suffix,
          "src/assets/" + GeneratorKind[generatorName] + "_" + suffix + ".jpg"
        );
      }
    }
  }

  create() {
    let noms = ["Aghilas", "Siham", "Youness", "Isa", "Nicolas", "Walid"];
    let textures = [
      "fawkes_tete",
      "hutex_tete",
      "robotec_tete",
      "spectre_tete",
      "totox_tete",
      "xmars_tete"
    ];

    const players: Player[] = [];
    for (let i = 0; i < 6; i++) {
      players.push(new Player(noms[i], textures[i]));
    }

    this.updatePlayers(players, 0);

    const profileRadius = 55 * window.devicePixelRatio;
    this.playerSlot = new PlayerSlot(
      this,
      profileRadius,
      this.players[this.playerIndex].name,
      this.players[this.playerIndex].specie
    );
    this.add.existing(this.playerSlot);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.resize(width, height);
  }

  resize(width: number, height: number) {
    this.updateSlotsPositions(width, height);
    for (let i = 0; i < this.opponentsSlots.length; i++) {
      const position = this.playerPosition(i);
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

  appendPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
    this.createPlayers();
  }

  removePlayer(removedPlayerIndex: number) {
    if (removedPlayerIndex < this.playerIndex) {
      this.playerIndex--;
    }
    this.players.splice(removedPlayerIndex, 1);
    this.createPlayers();
  }

  distributeCards(cards: Card[]) {}

  createPlayers() {
    // Remove any previously existing opponent slot
    for (const opponentSlot of this.opponentsSlots) {
      opponentSlot.destroy();
    }
    this.opponentsSlots = [];

    // Create opponents
    let index = (this.playerIndex + 1) % this.players.length;
    let opponentIndex = 0;
    while (index != this.playerIndex) {
      const opponent = this.players[index];
      const opponentSlot = new OpponentSlot(
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
    const horizontalDistance = 100 * window.devicePixelRatio;
    const verticalDistance = 115 * window.devicePixelRatio;
    const heightDiff = 325 * window.devicePixelRatio;
    const minHeight = 400 * window.devicePixelRatio;
    this.positions = [
      {
        x: horizontalDistance,
        y: Math.max(height - heightDiff, minHeight)
      },
      { x: horizontalDistance, y: verticalDistance },
      { x: width / 2, y: verticalDistance },
      { x: width - horizontalDistance, y: verticalDistance },
      {
        x: width - horizontalDistance,
        y: Math.max(height - heightDiff, minHeight)
      }
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
    6: [0, 1, 2, 3, 4]
  };

  static slotsLayouts = {
    2: [SlotLayout.Middle],
    3: [SlotLayout.TopLeft, SlotLayout.TopRight],
    4: [SlotLayout.BottomLeft, SlotLayout.Middle, SlotLayout.BottomRight],
    5: [
      SlotLayout.BottomLeft,
      SlotLayout.TopLeft,
      SlotLayout.TopRight,
      SlotLayout.BottomRight
    ],
    6: [
      SlotLayout.BottomLeft,
      SlotLayout.TopLeft,
      SlotLayout.Middle,
      SlotLayout.TopRight,
      SlotLayout.BottomRight
    ]
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
