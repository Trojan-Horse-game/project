import { GameScene } from "./gameScene";
import "phaser";
const config = {
  title: "Les cavaliers de troie",
  width: 1280,
  height: 780,
  parent: "game",
  scene: [GameScene],
  //backgroundColor: "#000033"
};



export class CavalierDeTroie extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}
window.onload = () => {
  var game = new CavalierDeTroie(config);
};
