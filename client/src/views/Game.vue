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
      <button
        id="launch"
        disabled
        @click="launchGame()"
        v-if="gameId != 'ROOM-' + this.$socket.id"
      >
        En attente de lancement
      </button>
    </div>
    <div id="endFilter" v-if="gameState == false && endGame == true">
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
    </div>
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
  GameNetworkDelegate,
  GeneratorSlot,
  NetworkCard,
  Species,
  stringToSpecie,
  colorToAction,
  colorToGenerator,
  NetworkColor
} from "../../game-interface/src/GameNetworkDelegate";
import { GameScene, Player } from "../../game-interface/src/GameScene";
import { ResponsiveScene } from "../../game-interface/src/ResponsiveScene";
import {
  ActionCard,
  Card,
  GeneratorCard,
  GeneratorCardKind
} from "../../game-interface/src/Card";
import axios from 'axios';

export default {
  name: "Jeu",
  data: () => {
    return {
      apiUrl : "https://api.trojanhorse.cc/users",
      gameState: false,
      endGame: false,
      winner: false,
      gameId: localStorage.getItem("gameId"),
      initialize: false,
      game: {
        type: Phaser.AUTO,
        scale: {
          parent: "game",
          mode: Phaser.Scale.ScaleModes.NONE,
          width: window.innerWidth * window.devicePixelRatio,
          height: window.innerHeight * window.devicePixelRatio,
          zoom: 1 / window.devicePixelRatio
        },
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
    this.game.scene.delegate = new GameNetworkDelegate(
      this.gameId,
      this.$socket
    );
    this.initialize = true;
    window.addEventListener("resize", () => {
      const w = window.innerWidth * window.devicePixelRatio;
      const h = window.innerHeight * window.devicePixelRatio;
      this.game.instance.scale.resize(w, h);
      this.game.instance.scene.scenes.forEach(scene => {
        if (scene.scene.settings.active) {
          scene.cameras.main.setViewport(0, 0, w, h);
          if (scene instanceof ResponsiveScene) {
            scene.resize(w, h);
          }
        }
      });
    });
  },
  computed: {
    currentScene: function(): GameScene {
      return this.game.scene;
    }
  },
  methods: {
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
      localStorage.removeItem("gameId");
      this.setLoss();
      this.$router.push("/menuPrincipal");
    },
    async setWin() {
      const userId = localStorage.getItem("userId");
      const url = `${this.apiUrl}/wins/${userId}`;
      axios.put(url);
    },
    async setLoss() {
      const userId = localStorage.getItem("userId");
      const url = `${this.apiUrl}/looses/${userId}`;
      axios.put(url);
    },
  },
  sockets: {
    /*
    closeTab: function() {
      this.$router.push("/menuPrincipal");
    },
    */
    gameId: function(gameId: string) {
      console.log(gameId);
    },
    joinGame: function(data) {
      console.log(this.currentScene);
      const pseudo: string = data.pseudo;
      const specie: Species = data.species;
      const player = new Player(pseudo, specie);
      this.currentScene.appendPlayer(player);
    },
    players: function(data) {
      const pseudo: string[] = data.pseudo;
      const species: Species[] = data.species;
      const playerIndex: number = data.index;
      const playersList: Player[] = [];
      console.log("players", pseudo, species);
      console.log("pseudo length", pseudo.length);
      setTimeout(() => {
        for (let i = 0; i < pseudo.length; i++) {
          console.log("player :", playerIndex, pseudo[i], species[i]);
          playersList.push(new Player(pseudo[i], species[i]));
        }
        this.currentScene.updatePlayers(playersList, playerIndex);
      }, 2000);
    },
    hand: function(data) {
      const hand: NetworkCard[] = data.hand;
      const kind: string[] = data.kind;
      const colors: NetworkColor[] = hand.map(value => {
        return value.color;
      });
      const cards: Card[] = [];
      for (let i = 0; i < hand.length; i++) {
        switch (kind[i]) {
          case "firewall":
            cards.push(
              new GeneratorCard(
                GeneratorCardKind.Medicine,
                colorToGenerator(colors[i])
              )
            );
            break;
          case "generator":
            cards.push(
              new GeneratorCard(
                GeneratorCardKind.Generator,
                colorToGenerator(colors[i])
              )
            );
            break;
          case "virus":
            cards.push(
              new GeneratorCard(
                GeneratorCardKind.Virus,
                colorToGenerator(colors[i])
              )
            );
            break;
          case "action":
            cards.push(new ActionCard(colorToAction(colors[i])));
            break;
        }
      }
      this.currentScene.deck.distributeCards(cards);
      this.gameState = true;
      console.log("hand", hand, kind);
    },
    base: function(data) {
      const generators: GeneratorSlot[] = data.base;
      const idx: number = data.idx;
      this.gameState = true;
      console.log("base", generators, idx);
      this.currentScene.updateBase(generators, idx);
    },
    checkCard: function(data) {
      const action: Action = data.action;
      const result: string | null = data.result;
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
      console.log("players from nextTurn", this.currentScene.players);
      console.log("playerIndex:", this.currentScene.playerIndex);
      console.log("currentPlayer:", this.currentScene.currentPlayer);

      console.log("next turn", playerIdx);
      this.gameState = true;
      this.currentScene.nextTurn(playerIdx);
    },
    discard: function(data) {
      const indexDiscard: number = data.indexDiscard;
      const cards: NetworkCard[] = data.cards;
      console.log("discard", indexDiscard, cards);
    },
    leaveGame: function(playerIdx) {
      console.log("left the game", playerIdx);
      this.currentScene.removePlayer(playerIdx);
    },
    endGame: function(winner) {
      this.gameState = false;
      this.endGame = true;
      if (winner == this.currentScene.playerIndex) {
        this.winner = true;
        this.setWin();
      }
      else {
        this.winner = false;
        this.setLoss();
      }
      localStorage.removeItem("gameId");
    },
    valid: function() {
      this.currentScene.reactToDropAction(true);
    },
    oops: function(error) {
      this.gameState = false;
      this.endGame = false;
      alert(error);
      if(error == "ERROR: Could not find game !")
        this.$router.push("/menuPrincipal");
    },
    oopsGame: function(error) {
      this.currentScene.reactToDropAction(false);
    }
    /*
    restricted : function() {
      this.$router.push("/menuPrincipal");
    }
    */
  },
  watch: {
    $route(to,from){
      if(to == "/choixEspece")
        this.$socket.emit("abbandon", localStorage.getItem("gameId"));
    }
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
  text-align: center;
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
