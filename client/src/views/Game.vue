<template>
  <div id="jeu">
    <ion-phaser :game.prop="game" :initialize.prop="true" />
    <span id="gameId">{{ gameId }}</span>
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import { Action, GeneratorSlot, NetworkCard, Specie } from "../../game-interface/src/GameNetworkDelegate";
import { GameScene, Player } from "../../game-interface/src/GameScene";
import { ResponsiveScene } from "../../game-interface/src/ResponsiveScene";

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
      scene: [new GameScene("", new Player(localStorage.getItem("username"), Specie.Spectre))]
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

    this.$socket.emit("gameState");
  },
  methods : {
    didDropCard(cardIndex: number, playerIndex: number, generatorIndex: number) {
      try {
        console.log("didDropCard", cardIndex, playerIndex, generatorIndex);
        const action = new Action(cardIndex);
        action.addTarget(playerIndex);
        action.addSlotTarget(generatorIndex);
        action.addTarget(playerIndex);
        this.$socket.emit("play card", this.room, action);
      } catch (err) {
        console.error(err);
      }
    },
    didDiscard(cardsIndices: number[]) {
      console.log("Did discard", cardsIndices);
      try {
        this.$socket.emit("discard", this.room, cardsIndices);
      } catch (err) {
        console.error(err);
      }
    },
    launchGame(roomId: string) {
      try {
        this.$socket.emit("launch game", this.room);
      } catch (err) {
        console.error(err);
      }
    },

  },
  sockets : {
    // closeTab : function() {
    //   this.$router.push("/menuPrincipal");
    // },
    gameId : function(gameId: string) {
      console.log(gameId)
    },
    joinGame : function(pseudo: string,specie: Specie) {
      console.log("joined the game :",pseudo, specie)
      const player = new Player(pseudo, specie);
      this.scene.appendPlayer(player);
    },
    players : function(pseudo: string[], species: Specie[], playerIndex: number) {
      const players: Player[] = [];
        for (let i = 0; i < pseudo.length; i++) {
          console.log("player :", playerIndex, pseudo[i], species[i])
          players.push(new Player(pseudo[i], species[i]));
        }
        this.scene.updatePlayers(players, -1);
    },
    hand : function(hand: NetworkCard[], kind: string[]) {
      console.log("hand",hand,kind)
    },
    base : function(generators: GeneratorSlot[], idx: number) {
      console.log("base",generators)
    },
    checkCard : function(action: Action, result: string | null) {
      if (typeof result == "string") {
        console.log("valid action",action, result)
      }
      else console.log("invalid action", action)
    },
    playCard : function(action: Action) {
      console.log("play card", action)
      const opponent = action.target[0];
      const slotTarget = action.slotTarget[0];
    },
    nextTurn : function(playerIdx: number) {
      console.log("next turn", playerIdx)
      this.scene.nextTurn(playerIdx);
    },
    discard : function(indexDiscard: number, cards: NetworkCard[]) {
      console.log("discard",indexDiscard, cards)
    },
    leaveGame : function(playerIdx){
      console.log("left the game",playerIdx)
      this.scene.removePlayer(playerIdx);
    },
    endGame : function(winner) {
      console.log(winner)
      // this.winnerIdx = winner;
    },
    oops : function(error) {
      alert(error);
    },
    // restricted : function() {
    //   this.$router.push("/menuPrincipal");
    // }
  }
};
</script>

<style scoped>
#jeu {
  width: 100%;
  height: 100%;
}

#gameId {
  left: 0;
  bottom: 0;
  margin: 2%;
  font-size: 25px;
  color: white;
}
</style>
