<template>
  <div id="jeu">
    <ion-phaser :game.prop="game" :initialize.prop="true" />
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import {
  GameScene,
  Player,
  ResponsiveScene
} from "../../game-interface/src/GameScene";

export default {
  name: "Jeu",

  data: () => ({
    game: {
      type: Phaser.AUTO,
      title: "Les Cavaliers de Troie",
      mipmapFilter: "LINEAR_MIPMAP_LINEAR",
      scale: {
        parent: "jeu",
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth * window.devicePixelRatio,
        height: window.innerHeight * window.devicePixelRatio,
        zoom: 1 / window.devicePixelRatio
      },
      scene: [new GameScene(new Player("Youness", "xmars_tete"))]
    }
  }),

  mounted: function() {
    const game = new Phaser.Game(this.config);

    window.addEventListener("resize", function() {
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
  }
};
</script>

<style scoped>
#jeu {
  width: 100vw;
  height: 100vh;
}
</style>
