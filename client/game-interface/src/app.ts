import { GameScene } from "./gameScene";
import "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  render: {
    antialias: true,
    antialiasGL: true,
  },
  title: "Les cavaliers de troie",
  scale: {
    parent: "game",
    mode: Phaser.Scale.ScaleModes.FIT,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [GameScene],
};


export class CavalierDeTroie extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}
window.onload = () => {
  var game = new CavalierDeTroie(config);

};

