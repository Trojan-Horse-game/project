<template>
  <div id="jeu">
    <ion-phaser :game.prop="game" :initialize.prop="true" />
    <div id="filter" v-if="gameState == false && endGame == false">
      <button id="launch" @click="launchGame()" :disabled="this.gameId == 'ROOM-'+this.$socket.id ? false : true">Lancer la partie</button>
      </div>
    <div id="endFilter" v-if="gameState == false && endGame == true">
      <div id="logo">
        <img src="logo.png" alt="Logo du jeu" />
      </div>
        <div id="container">
          <div id="result" v-if="winner == true">YOU WIN</div>
          <div id="result" v-if="winner == false">YOU LOOSE</div>
          <router-link to="/menuPrincipal"><button id="retour"><p id="textRetour">Menu principal</p></button></router-link>
      </div>
    </div>
    <span id="gameId">{{ this.gameId }}</span>
<<<<<<< HEAD
    <v-btn @click="abandon()" id="abandon" title="Quitter la partie" medium icon><v-icon>mdi-logout</v-icon></v-btn>
=======
>>>>>>> 0a6fd23073949fcb2b2e0b4d0b529fc2cbfaecce
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
    gameState : false,
    endGame : false,
    winner : false,
    gameId: localStorage.getItem("gameId"),
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
      scene: new GameScene(localStorage.getItem("gameId"), new Player(localStorage.getItem("username"), Specie.Hutex))
    },
  }),

  mounted: function() {

    this.window.addEventListener("resize", () => {
      const w = window.innerWidth * window.devicePixelRatio;
      const h = window.innerHeight * window.devicePixelRatio;
      this.game.scale.resize(w, h);

      // for (const scene of game.scene.scenes) {
        if (this.game.scene.settings.active) {
          this.game.scene.cameras.main.setViewport(0, 0, w, h);
          if (this.game.scene instanceof ResponsiveScene) {
            this.game.scene.resize(w, h);
          }
        }
      // }
    });

    // this.$socket.emit("gameState");
  },
  methods : {
    didDropCard(cardIndex: number, playerIndex: number, generatorIndex: number) {
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
        this.gameState = true;
        this.$socket.emit("launch game", this.gameId);
      } catch (err) {
        console.error(err);
      }
    },
    abandon() {
      this.$socket.emit("abbandon", this.gameId);
      this.$router.push("/menuPrincipal");
    }

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
      this.gameState = false;
      this.endGame = true;
      console.log(winner)
      // this.winnerIdx = winner;
    },
    oops : function(error) {
      this.gameState = false;
      this.endGame = false;
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
  z-index: 50;
  left: 0;
  bottom: 0;
  margin: 2%;
  font-size: 100%;
  color: #bbbbbb;
  position: fixed;
}

#abandon {
  z-index: 50;
  right: 6%;
  background-color:transparent !important;
  bottom: 1%;
  position: fixed;
}

#filter {
  position: fixed;
  z-index: 49;
  width: 100%;
  background-color: rgba(47,47,47,0.3);
  margin:auto;
  text-align-last: center;
  height: 100%;
  color: white;
  align-self: center;
  font-size: 400%;
  justify-content: center;
}

#endFilter{
  position: fixed;
  z-index: 49;
  width: 100%;
  height: 100%;
  background-color: rgba(47,47,47,0.8);
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

#launch:hover{
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
  background-image : url("../../public/Design/boutonMenu.png");
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
