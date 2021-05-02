import { NewScene, ResponsiveScene, Player } from "./NewScene";
import "phaser";

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
  scene: [new NewScene([new Player("Youness", "xmars_tete")], 0)]
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
