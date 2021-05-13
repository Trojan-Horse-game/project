<template>
  <div id="jeu">
    <div id="filter" v-if="gameState == false && endGame == false">
      <button
        id="launch"
        @click="launchGame()"
        v-if="gameId == 'ROOM-' + this.$socket.id"
      >
        Lancer la partie
      </button>
    </div>
    <!-- <div id="endFilter" v-if="gameState == false && endGame == true">
      <div id="logo">
        <img src="logo.png" alt="Logo du jeu" />
      </div>
      <div id="container">
        <div id="result" v-if="winner == true">YOU WIN</div>
        <div id="result" v-if="winner == false">YOU LOOSE</div>
        <router-link to="/menuPrincipal"
          ><button id="retour">
            <p id="textRetour">Menu principal</p>
          </button></router-link
        >
      </div>
    </div> -->
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
    <span id="gameId">{{ this.gameId }}</span>
    <v-btn @click="abandon()" id="abandon" title="Quitter la partie" medium icon
      ><v-icon>mdi-logout</v-icon></v-btn
    >
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import {
  Action,
  GeneratorSlot,
  NetworkCard,
  Species,
  stringToSpecie
} from "../../game-interface/src/GameNetworkDelegate";
import { GameScene, Player } from "../../game-interface/src/GameScene";
import { ResponsiveScene } from "../../game-interface/src/ResponsiveScene";

export default {
  name: "Jeu",
  data: () => {
    return {
      gameState: false,
      endGame: false,
      winner: false,
      gameId: localStorage.getItem("gameId"),
      initialize: false,
      game: {
        width: window.innerWidth * window.devicePixelRatio,
        height: window.innerHeight * window.devicePixelRatio,
        zoom: 1 / window.devicePixelRatio,
        type: Phaser.AUTO,
        scene: new GameScene(
          localStorage.getItem("gameId"),
          new Player(
            localStorage.getItem("username"),
            stringToSpecie(localStorage.getItem("specie"))
          )
        )
      }
    };
  },
  mounted() {
    console.log("socket id", this.$socket.id);
    this.initialize = true;
    console.log(this.game);
    window.addEventListener("resize", () => {
      const w = window.innerWidth * window.devicePixelRatio;
      const h = window.innerHeight * window.devicePixelRatio;
      console.log(this.game);
      console.log(this.game.scale);
      this.game.scale.resize(w, h);
      for (const scene of this.game.scene.scenes) {
        if (scene.scene.settings.active) {
          scene.cameras.main.setViewport(0, 0, w, h);
          if (scene instanceof ResponsiveScene) {
            scene.resize(w, h);
          }
        }
      }
    });
  },
  methods: {
    didDropCard(
      cardIndex: number,
      playerIndex: number,
      generatorIndex: number
    ) {
      try {
        console.log("didDropCard", cardIndex, playerIndex, generatorIndex);
        const action = new Action(cardIndex);
        action.addTarget(playerIndex);
        action.addSlotTarget(generatorIndex);
        action.addTarget(playerIndex);
        this.$socket.emit("play card", this.gameId, action);
      } catch (err) {
        console.error(err);
      }
    },
    didDiscard(cardsIndices: number[]) {
      console.log("Did discard", cardsIndices);
      try {
        this.$socket.emit("discard", this.gameId, cardsIndices);
      } catch (err) {
        console.error(err);
      }
    },
    launchGame() {
      try {
        this.$socket.emit("launch game", this.gameId);
        this.gameState = true;
      } catch (err) {
        console.error(err);
      }
    },
    abandon() {
      this.$socket.emit("abbandon", this.gameId);
      this.$router.push("/menuPrincipal");
    }
  },
  sockets: {
    // closeTab : function() {
    //   this.$router.push("/menuPrincipal");
    // },
    gameId: function(gameId: string) {
      console.log(gameId);
    },
    joinGame: function(data) {
      const pseudo: string = data[0];
      const specie: Species = data[1];
      const player = new Player(pseudo, specie);
      this.game.scene.appendPlayer(player);
    },
    players: function(data) {
      const pseudo: string[] = data[0];
      const species: Species[] = data[1];
      const playerIndex: number = data[2];
      const playersList: Player[] = [];
      for (let i = 0; i < pseudo.length; i++) {
        console.log("player :", playerIndex, pseudo[i], species[i]);
        playersList.push(new Player(pseudo[i], species[i]));
      }
      this.game.scene.updatePlayers(playersList, -1);
    },
    hand: function(data) {
      const hand: NetworkCard[] = data[0];
      const kind: string[] = data[1];
      this.gameState = true;
      console.log("hand", hand, kind);
    },
    base: function(data) {
      const generators: GeneratorSlot[] = data[0];
      const idx: number = data[1];
      this.gameState = true;
      console.log("base", generators);
    },
    checkCard: function(data) {
      const action: Action = data[0];
      const result: string | null = data[1];
      if (typeof result == "string") {
        console.log("valid action", action, result);
      } else console.log("invalid action", action);
    },
    playCard: function(action: Action) {
      console.log("play card", action);
      const opponent = action.target[0];
      const slotTarget = action.slotTarget[0];
    },
    nextTurn: function(playerIdx: number) {
      console.log("next turn", playerIdx);
      this.gameState = true;
      this.game.scene.nextTurn(playerIdx);
    },
    discard: function(data) {
      const indexDiscard: number = data[0];
      const cards: NetworkCard[] = data[0];
      console.log("discard", indexDiscard, cards);
    },
    leaveGame: function(playerIdx) {
      console.log("left the game", playerIdx);
      this.game.scene.removePlayer(playerIdx);
    },
    endGame: function(winner) {
      this.gameState = false;
      this.endGame = true;
      console.log(winner);
      // this.winnerIdx = winner;
    },
    oops: function(error) {
      this.gameState = false;
      this.endGame = false;
      alert(error);
    }
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

#logo {
  position: absolute;
  text-align-last: auto;
  top: 1%;
  left: 1%;
  width: unset;
  width: fit-content;
}

#logo img {
  width: 20% !important;
  height: auto;
}

#gameId {
  z-index: 49;
  left: 0;
  bottom: 0;
  margin: 2%;
  font-size: 100%;
  color: #bbbbbb;
  position: fixed;
}

#abandon {
  z-index: 50;
  right: 105px;
  background-color: transparent !important;
  bottom: 8px;
  position: fixed;
}

#filter {
  position: fixed;
  z-index: 49;
  width: 100%;
  background-color: rgba(47, 47, 47, 0.3);
  margin: auto;
  text-align-last: center;
  height: 100%;
  color: white;
  align-self: center;
  font-size: 400%;
  justify-content: center;
}

#endFilter {
  position: fixed;
  z-index: 49;
  width: 100%;
  height: 100%;
  background-color: rgba(47, 47, 47, 0.8);
}

#container {
  width: 100%;
  height: 100%;
  margin: 5% 0;
}

#launch {
  text-shadow: 4px 4px rgb(83, 82, 85);
  align-self: center;
  top: 40%;
  position: relative;
}

#launch:hover {
  color: #bbbbbb;
}

#result {
  background-color: #2f363c;
  font-size: 700%;
  margin: auto;
  text-align: center;
  width: -webkit-min-content;
  width: -moz-min-content;
  width: min-content;
  height: -webkit-min-content;
  height: -moz-min-content;
  height: min-content;
  color: #bbbbbb;
  padding: 2%;
}

#retour {
  background-image: url("../../public/Design/boutonMenu.png");
  color: #fff;
  width: 100%;
  margin: auto;
  height: 12%;
  background-size: contain;
  background-position: center;
  padding: 2%;
  text-align: center;
  font-size: 50%;
  vertical-align: sub;
  margin: 3% 0;
}

#textRetour {
  width: 10%;
  margin: 2%;
  margin: auto;
  text-align: center;
  font-size: large;
}
</style>
