/* eslint-disable @typescript-eslint/no-use-before-define */
import "phaser";
import { OpponentSlot, SlotLayout } from "./OpponentSlot";
import { PlayerSlot } from "./PlayerSlot";
import {
  ActionCardKind,
  GeneratorKind,
  GeneratorCardKind,
  GeneratorCard
} from "./Card";
import { CardDeck } from "./CardDeck";
import { GameSceneDelegate } from "./GameSceneDelegate";
import { ProfilePicture } from "./ProfilePicture";
import { CardSprite } from "./CardSprite";
import { ActionDropZone } from "./ActionDropZone";
import { ResponsiveScene } from "./ResponsiveScene";
import { Specie, specieToString } from "./GameNetworkDelegate";

export class GameScene extends ResponsiveScene {
  constructor(currentPlayer: Player) {
    super({});
    this.players = [currentPlayer];
    this.playerIndex = 0;
    this.currentPlayer = 0;
  }

  players: Player[];
  playerIndex: number;
  currentPlayer: number;

  positions: Position[];

  delegate: GameSceneDelegate;

  // Phaser game objects
  deck: CardDeck;
  actionDropZone: ActionDropZone;
  playerSlot: PlayerSlot;
  opponentsSlots: OpponentSlot[] = [];
  timerUpdater: number;
  timerTimeout: number;

  preload() {
    // Character pictures
    this.load.image("fawkes", "src/assets/Fawkes_tete.png");
    this.load.image("hutex", "src/assets/Hutex_tete.png");
    this.load.image("robotec", "src/assets/Robotec_tete.png");
    this.load.image("spectre", "src/assets/Spectre_tete.png");
    this.load.image("totox", "src/assets/Totox_tete.png");
    this.load.image("xmars", "src/assets/Xmars_tete.png");

    // Generator icons
    this.load.image("electricity", "src/assets/foudre_log.png");
    this.load.image("air", "src/assets/air_log.png");
    this.load.image("water", "src/assets/goute_log.png");
    this.load.image("shield", "src/assets/radiation_log.png");
    this.load.image("joker", "src/assets/super_log.png");
    this.load.image("super_sign", "src/assets/super.png");

    // Action drop zone
    this.load.image("dropzone_circle", "src/assets/dropzone_circle.png");
    this.load.image("utiliser", "src/assets/utiliser.png");

    // Cards
    this.load.image("carte_verso", "src/assets/carte_verso.png");
    // Action cards assets
    for (const actionName in ActionCardKind) {
      this.load.image(
        ActionCardKind[actionName],
        "src/assets/" + ActionCardKind[actionName] + ".jpg"
      );
    }
    // Generator card assets
    const suffixes = ["G", "P", "V"];
    for (const suffix of suffixes) {
      for (const generatorName in GeneratorKind) {
        this.load.image(
          GeneratorKind[generatorName] + "_" + suffix,
          "src/assets/" + GeneratorKind[generatorName] + "_" + suffix + ".jpg"
        );
      }
    }
  }

  create() {
    const kinds = [
      GeneratorCardKind.Generator,
      GeneratorCardKind.Medicine,
      GeneratorCardKind.Virus
    ];

    const generatorKinds = [
      GeneratorKind.Air,
      GeneratorKind.Electricity,
      GeneratorKind.Joker,
      GeneratorKind.Shield,
      GeneratorKind.Water
    ];

    document.onkeypress = e => {
      if (e.code == "KeyD") {
        const cards: GeneratorCard[] = [];
        for (let i = 0; i < this.playerSlot.discardedIndices.length; i++) {
          cards.push(
            new GeneratorCard(
              kinds[Math.floor(Math.random() * kinds.length)],
              generatorKinds[Math.floor(Math.random() * generatorKinds.length)]
            )
          );
        }
        this.deck.distributeCards(cards);
      }
    };

    this.updatePlayers(
      [
        new Player("Foo", Specie.Hutex),
        new Player("Bar", Specie.Sonyas),
        new Player("Baz", Specie.Totox)
      ],
      0
    );
    this.actionDropZone = new ActionDropZone(
      this,
      70 * window.devicePixelRatio
    );
    this.add.existing(this.actionDropZone);

    const profileRadius = 55 * window.devicePixelRatio;
    this.playerSlot = new PlayerSlot(
      this,
      profileRadius,
      this.players[this.playerIndex].name,
      specieToString(this.players[this.playerIndex].specie)
    );
    this.playerSlot.setDepth(200);
    this.add.existing(this.playerSlot);

    const ratio = 0.7069;
    const cardHeight = profileRadius * 3.5;
    const cardWidth = cardHeight * ratio;

    this.deck = new CardDeck(this, cardWidth, cardHeight);
    for (let i = 0; i < 10; i++) {
      const cardSprite = new CardSprite(this, null, cardWidth, cardHeight);
      this.deck.addCard(cardSprite);
    }
    this.add.existing(this.deck);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.resize(width, height);
    this.nextTurn(0);
    this.nextTurn(1);
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

    this.deck.setPosition(width / 2, height / 2 - 200);
    this.actionDropZone.setPosition(width / 2 - 150, height / 2 - 200);
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

  nextTurn(nextPlayer: number) {
    const nextOpponentSlotIndex =
      nextPlayer > this.playerIndex ? nextPlayer - 1 : nextPlayer;

    if (this.currentPlayer) {
      // If current player is the user
      if (this.currentPlayer == this.playerIndex) {
        this.playerSlot.profilePicture.timerPercentage = 0;
        this.playerSlot.playerInteractive = false;
      } else {
        const opponentSlotIndex =
          this.currentPlayer > this.playerIndex
            ? this.currentPlayer - 1
            : this.currentPlayer;
        this.opponentsSlots[
          opponentSlotIndex
        ].profilePicture.timerPercentage = 0;
      }
    }

    let nextPlayerProfilePicture: ProfilePicture;
    if (nextPlayer == this.playerIndex) {
      nextPlayerProfilePicture = this.playerSlot.profilePicture;
      this.playerSlot.playerInteractive = true;
    } else {
      nextPlayerProfilePicture = this.opponentsSlots[nextOpponentSlotIndex]
        .profilePicture;
    }
    nextPlayerProfilePicture.timerPercentage = 1;
    const duration = 20000;
    const fps = 30;
    const increments = 1 / (duration / 1000) / fps;
    this.timerUpdater = window.setInterval(() => {
      const current = nextPlayerProfilePicture.timerPercentage;
      const next = Math.max(current - increments, 0);
      nextPlayerProfilePicture.timerPercentage = next;
    }, 1000 / fps);
    this.timerTimeout = window.setTimeout(() => {
      clearInterval(this.timerUpdater);
    }, duration + 50);
    this.currentPlayer = nextPlayer;
  }

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
        specieToString(opponent.specie),
        index
      );

      this.opponentsSlots.push(opponentSlot);
      this.add.existing(opponentSlot);
      index = (index + 1) % this.players.length;
      opponentIndex++;
    }
  }

  slotLayoutForOpponent(opponentIndex: number): SlotLayout {
    return GameScene.slotsLayouts[this.players.length][opponentIndex];
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
    const index = GameScene.slotsMappings[this.players.length][playerIndex];
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
  constructor(name: string, specie: Specie) {
    this.name = name;
    this.specie = specie;
  }
  name: string;
  specie: Specie;
}
