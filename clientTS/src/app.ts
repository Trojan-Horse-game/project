import { GameScene } from "./gameScene";
import "phaser";
const config: GameConfig = {
  title: "Les cavaliers de troie",
  width: 800,
  height: 600,
  parent: "game",
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#000033"
};



export class CavalierDeTroie extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}
window.onload = () => {
  var game = new CavalierDeTroie(config);
};