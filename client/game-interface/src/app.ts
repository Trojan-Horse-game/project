import { GameScene, Player } from "./GameScene";
import { ResponsiveScene } from "./ResponsiveScene";
import "phaser";
import { GameNetworkDelegate } from "./GameNetworkDelegate";
import { Specie } from "./GameNetworkDelegate";

const scene = new GameScene("", new Player("Youness", Specie.Totox));
const delegate = new GameNetworkDelegate();
scene.delegate = delegate;
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  title: "Les Cavaliers de Troie",
  mipmapFilter: "LINEAR_MIPMAP_LINEAR",
  scale: {
    parent: "game",
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    zoom: 1 / window.devicePixelRatio
  },
  scene: [scene]
};

window.onload = () => {
  const game = new Phaser.Game(config);
  window.addEventListener("resize", () => {
    const w = window.innerWidth * window.devicePixelRatio;
    const h = window.innerHeight * window.devicePixelRatio;
    game.scale.resize(w, h);
    for (const scene of game.scene.scenes) {
      if (scene.scene.settings.active) {
        scene.cameras.main.setViewport(0, 0, w, h);
        if (scene instanceof ResponsiveScene) {
          scene.resize(w, h);
        }
      }
    }
  });
};
