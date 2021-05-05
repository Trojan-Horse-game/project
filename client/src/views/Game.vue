<template>
  <div class="App">
    <header class="App-header">
      <template v-if="!initialize">
        <div @click="initializeGame" class="flex">
          <a href="#1" class="bttn">Démarrer le jeu</a>
        </div>
      </template>
      <div id="jeu">
        <ion-phaser
          v-bind:game.prop="game"
          v-bind:initialize.prop="initialize"
        />
      </div>
    </header>

    <div>
      <router-link to="/menuPrincipal">
        <v-btn class="primary">Retour</v-btn>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import Card from "../clientTS/src/card";
import Zone from "../clientTS/src/Zone";
export default {
  name: "HelloWorld",
  data() {
    return {
      initialize: false,
      nbPlayers: 6,
      nbCartesTas: 3,

      game: {
        width: "100%",
        height: "100%",
        type: Phaser.AUTO,
        "render.transparent": true,
        scene: {
          init: function() {
            this.nbPlayers = 6;
          },

          preload: function() {
            this.load.image("background", "assets/BCK.gif");
            this.load.image("carte_verso", "assets/carte_verso.png");

            this.load.image("foudre", "assets/foudre_log.png");
            this.load.image("air", "assets/air_log.png");
            this.load.image("goute", "assets/goute_log.png");
            this.load.image("radiation", "assets/radiation_log.png");
            this.load.image("super", "assets/super_log.png");

            this.load.image("fawkes", "assets/Fawkes.png");
            this.load.image("hutex", "assets/Hutex.png");
            this.load.image("robotec", "assets/Robotec.png");
            this.load.image("spectre", "assets/Spectre.png");
            this.load.image("totox", "assets/Totox.png");
            this.load.image("xmars", "assets/Xmars.png");
          },
          create: function() {
            const bg: Phaser.GameObjects.Image = this.add
              .image(0, 0, "background")
              .setOrigin(0, 0)
              .setScale(1.09);

            //button distribution cards
            const dealText: Phaser.GameObjects.Text = this.add
              .text(75, 300, ["DEAL CARDS"])
              .setFontSize(18)
              .setFontFamily("Trebuchet MS")
              .setColor("#00ffff")
              .setInteractive();
            dealText.on("pointerover", function() {
              dealText.setColor("#ff69b4");
            });
            dealText.on("pointerout", function() {
              dealText.setColor("#00ffff");
            });

            //distribution of the cards
            const dealCards = () => {
              for (let i = 0; i < 3; i++) {
                const playerCard: Card = new Card(this);
                playerCard.displayCard(475 + i * 180, 670, "carte_verso");
              }
            };
            dealText.on("pointerdown", function() {
              dealCards();
            });

            //moves of the cards from the hand
            this.input.on(
              "dragstart",
              function(pointer, gameObject) {
                gameObject.setTint(0xccffff);
                this.children.bringToTop(gameObject);
              },
              this
            );

            this.input.on("drag", function(pointer, gameObject, dragX, dragY) {
              gameObject.x = dragX;
              gameObject.y = dragY;
              gameObject.setTint(0xccffff);
              gameObject.setScale(0.01);
            });

            this.input.on("dragend", function(pointer, gameObject, dropped) {
              gameObject.setTint();
              gameObject.setScale(0.05);
              if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.setScale(0.06);
              }
            });

            //pile of cards + dropzone + drawing limit of the dropzone
            const tasZone = new Zone(this);
            const renderZone = tasZone.renderZone("tas");
            const outline = tasZone.renderOutline(renderZone);

            //highlight the pile of cards zone when dragenter
            this.input.on("dragenter", function(pointer, gameObject, dropZone) {
              if (dropZone.name == "tas") {
                outline.clear();
                outline.lineStyle(4, 0xff66ff);
                outline.strokeRect(
                  renderZone.x - renderZone.input.hitArea.width / 2,
                  renderZone.y - renderZone.input.hitArea.height / 2,
                  renderZone.input.hitArea.width,
                  renderZone.input.hitArea.height
                );
              }
            });
          }
        }
      }
    };
  },
  methods: {
    initializeGame: function() {
      this.initialize = true;
    }
  }
};
</script>

<style scoped>
.flex {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  vertical-align: middle;
  margin: 0 auto;
}

a.bttn {
  color: #ff0072;
  text-decoration: none;
  -webkit-transition: 0.3s all ease;
  transition: 0.3s ease all;
}
a.bttn:hover {
  color: #fff;
}
a.bttn:focus {
  color: #fff;
}
a.bttn-dark {
  color: #644cad;
  text-decoration: none;
  -webkit-transition: 0.3s all ease;
  transition: 0.3s ease all;
}
a.bttn-dark:hover {
  color: #fff;
}
a.bttn-dark:focus {
  color: #fff;
}
.bttn {
  font-size: 18px;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: inline-block;
  text-align: center;
  width: 270px;
  font-weight: bold;
  padding: 14px 0px;
  border: 3px solid #ff0072;
  border-radius: 2px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1);
}
.bttn:before {
  -webkit-transition: 0.5s all ease;
  transition: 0.5s all ease;
  position: absolute;
  top: 0;
  left: 50%;
  right: 50%;
  bottom: 0;
  opacity: 0;
  content: "";
  background-color: #ff0072;
  z-index: -2;
}
.bttn:hover:before {
  -webkit-transition: 0.5s all ease;
  transition: 0.5s all ease;
  left: 0;
  right: 0;
  opacity: 1;
}
.bttn:focus:before {
  transition: 0.5s all ease;
  left: 0;
  right: 0;
  opacity: 1;
}

#jeu {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -10;
  -ms-touch-action: none;
  touch-action: none;
  background-image: url("../../public/Design/fond_plateau.gif");
  width: 100%;
  height: 100%;
}
</style>
