<template>
  <v-app>
    <div
      id="background-image"
      :class="{
        fawkes: selected.name == 'fawkes',
        hutex: selected.name == 'hutex',
        robot: selected.name == 'robotec',
        spectre: selected.name == 'spectre',
        totox: selected.name == 'totox',
        xmars: selected.name == 'xmars'
      }"
    />
    <div id="logo">
      <router-link to="/menuPrincipal">
        <img src="logo.png" alt="Logo du jeu"
      /></router-link>
    </div>
    <div id="container">
      <div id="titre">Choix de l'espèce</div>

      <div id="content">
        <div id="especes">
          <span
            :class="[{ active: selected.name == 'fawkes' }, 'cercle']"
            id="fawkes"
            @click="select(0)"
          >
            <img
              src="../../public/Design/fawkes.png"
              alt="fawkes"
              v-if="!isLocked('fawkes')"
            />
            <img
              src="../../public/Design/fawkes_locked.png"
              alt="fawkes"
              v-else
            />
          </span>

          <span
            :class="[{ active: selected.name == 'hutex' }, 'cercle']"
            id="hutex"
            @click="select(1)"
            ><img
              src="../../public/Design/hutex.png"
              alt="hutex"
              v-if="!isLocked('hutex')"/>
            <img src="../../public/Design/hutex_locked.png" alt="hutex" v-else
          /></span>
          <span
            :class="[{ active: selected.name == 'robotec' }, 'cercle']"
            id="robot"
            @click="select(2)"
            ><img
              src="../../public/Design/robot.png"
              alt="robot"
              v-if="!isLocked('robot')"/>
            <img src="../../public/Design/robot_locked.png" alt="robot" v-else
          /></span>
          <span
            :class="[{ active: selected.name == 'spectre' }, 'cercle']"
            id="spectre"
            @click="select(3)"
            ><img
              src="../../public/Design/spectre.png"
              alt="spectre"
              v-if="!isLocked('spectre')"/>
            <img
              src="../../public/Design/spectre_locked.png"
              alt="spectre"
              v-else
          /></span>
          <span
            :class="[{ active: selected.name == 'totox' }, 'cercle']"
            id="totox"
            @click="select(4)"
            ><img
              src="../../public/Design/totox.png"
              alt="totox"
              v-if="!isLocked('totox')"/>
            <img src="../../public/Design/totox_locked.png" alt="totox" v-else
          /></span>
          <span
            :class="[{ active: selected.name == 'xmars' }, 'cercle']"
            id="xmars"
            @click="select(5)"
            ><img
              src="../../public/Design/xmars.png"
              alt="xmars"
              v-if="!isLocked('xmars')"/>
            <img src="../../public/Design/xmars_locked.png" alt="xmars" v-else
          /></span>
        </div>
        <div id="partieDroite">
          <div id="fiche">
            <div class="attribut">
              <span class="nom">Espèce</span>
              <span class="text"
                ><p class="text-fill">{{ selected.name }}</p></span
              >
            </div>

            <div class="attribut">
              <span class="nom">Origine</span>
              <div class="text">
                <p class="text-fill">{{ selected.origin }}</p>
              </div>
            </div>

            <div class="attribut">
              <p class="nom">Force</p>
              <div class="text" id="force">
                <p class="text-fill">{{ selected.strength }}</p>
              </div>
            </div>

            <div class="attribut" id="description">
              <span class="nom">Description</span>
              <div class="text">
                <p class="text-fill">{{ selected.description }}</p>
              </div>
            </div>
          </div>

          <div id="boutons">
            <button id="prev" @click="prev()" />
            <button
              id="valider"
              @click="lockChoice()"
              :class="{
                disabled: this.lockedChoices.includes(this.selected.name)
              }"
            />
            <button id="next" @click="next()" />
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import { Species } from "../../game-interface/src/GameNetworkDelegate";
export default {
  data: () => ({
    species: [
      {
        id: 4,
        name: "fawkes",
        origin: "fakous",
        strength: " Maîtrise du piratage et de l’aérospatial",
        description:
          "Étant plus petit que la moyenne humaine, Fawkes compense par sa perspicacité et son intelligence. Il a les cheveux longs et il s’habille d’une façon classique avec un chapeau melon lui rappelant ses origines. une forme corporelle assez petite, long cheveux, un bonnet sur la tête, portant des vêtements classiques. Un humanoïde qui a l’air presque comme les autres."
      },
      {
        id: 0,
        name: "hutex",
        origin: "Hucex",
        strength: "Manipulation du champ gravitationnel",
        description:
          "Avec ses vêtements déchirés et son visage borgne, Hutex terrifie ses adversaires. Quelle que soit la situation, cet individu est plein de ressources et il sera prêt à y  faire face. Il est vétu d’un bandeau blanc, signifiant sa determination à atteindre ses objectifs. Ses vêtements déchirés et son œil gauche perdu sont exposés pour terrifier ses adversaires. Son sac à dos montre que cet individu est plein de ressources et toujours prêt à s'adapter à n’importe quelle situation qui se présente à lui. Et enfin son bandeau est toujours présenté comme blanc comme la neige pour montrer sa determination a atteindre ses objectifs."
      },
      {
        id: 1,
        name: "robotec",
        origin: "Dingjal Orlov",
        strength: "Capacité de calculer 10 milliard d’équations par seconde",
        description:
          "Robotec possède un corps métallique, plaquée or. Le bas de son corps semble deformé suite à un des combats lors de la révolution."
      },
      {
        id: 3,
        name: "spectre",
        origin: "Asgard",
        strength: "L’épée forgée dans le volcan de la planète Asgard",
        description:
          "Spectre possède des sourcils blancs et une longue barbe puisque jadis, ce fut un vieil homme. Vétu d’un linge blanc, il dégage une aura noire. Spectre a gardé sa forme humanoïde. Il porte dans son dos l’épée asgardienne et sur sa tête, tout comme la lampe de Pixar, il a une lumière aveuglante provenant de ses cornes."
      },
      {
        id: 5,
        name: "totox",
        origin: "unknown",
        strength: "unknown",
        description:
          "Totox a une apparence monstrueuse issue de la fusion d’un octopus et d’un humanoïde. Il agit et communique comme les humains mais il a des tentacules comme les octopus. On peut y apercevoir sur ces derniers des ongles remplies de venin. Il porte une longue cape noire imitant son héros d’enfance Dracula (son apparence monstrueuse est une fusion entre une octopus et une forme humanoïde. Ce dernier marche, s’habille,parle comme un être human, il porte une long cape noir et ils possedent meme des ongles sur la pointes de ses tentacules!)"
      },
      {
        id: 2,
        name: "xmars",
        origin: "mars",
        strength: "intimidation, ruse, tromperie",
        description:
          "Xmars a une apparence trompeuse. Il possède une forme humanoïde dissimulée sous sa carapace de pierre. Celle-ci lui donnant une taille ainsi qu’une force démesurées ce qui intimide tous ses adversaires. (son apparence est trompeuse. Il a une forme humanoïde cachée sous un bloc de pierre, ceci lui donne une fausse masse corporelle et une taille exagérée mais toute aussi efficace pour intimider ses adversaires.)"
      }
    ],
    count: 0,
    lockedSpecies: null,
    lockedChoices: []
  }),

  computed: {
    selected: function() {
      return this.species[this.count];
    }
  },
  methods: {
    lockChoice() {
      this.lockedSpecies = this.selected.name;
      this.lockedChoices.push(this.selected.name);
      this.$socket.emit("choose species", this.selected.id);
      localStorage.setItem("specie", this.selected.name);
      this.$router.push("/Jeu");
    },

    isLocked(speciesName: string) {
      return this.lockedChoices.includes(speciesName);
    },

    next() {
      this.count = (this.count + 1) % this.species.length;
    },

    prev() {
      const nbSpecies: number = this.species.length;
      this.count = (this.count - 1 + nbSpecies) % nbSpecies;
    },

    select(index: number) {
      this.count = index;
    }
  },
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
    // this.$socket.emit("gameState");
  },
  sockets: {
    availableSpecies: function(availableSpecies) {
      for (const specie of this.species) {
        if (!(specie.id in availableSpecies))
          this.lockedChoices.push(specie.name);
      }
    },
    gameId: function(gameId) {
      localStorage.setItem("gameId", gameId);
    },
    oops: function(error) {
      alert(error);
    }
    // closeTab : function() {
    //   this.$router.push("/menuPrincipal");
    // },
    // restricted : function() {
    //   this.$router.push("/menuPrincipal");
    // },
    // inGame : function() {
    //   this.$router.push("/Jeu");
    // }
  }
};
</script>

<style lang="scss" scoped>
$content: #2f363c;

#background-image {
  height: 100%;
}

#background-image.fawkes {
  background-image: url("../../public/Design/fawkes.gif");
}
#background-image.hutex {
  background-image: url("../../public/Design/hutex.gif");
}
#background-image.robot {
  background-image: url("../../public/Design/robot.gif");
}
#background-image.spectre {
  background-image: url("../../public/Design/spectre.gif");
}
#background-image.totox {
  background-image: url("../../public/Design/totox.gif");
}
#background-image.xmars {
  background-image: url("../../public/Design/xmars.gif");
}

#logo {
  position: absolute;
  top: 1%;
  left: 1%;
}

#logo img {
  width: 20% !important;
  height: auto;
}

#container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#content {
  width: 100%;
  height: 100%;
  z-index: 0;
  color: #000;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-content: space-around;
  align-items: center;
  font-size: 25px;
  justify-content: space-around;
  flex-grow: 1;
  margin: 0% 0% 2% 0%;
}

#especes {
  width: 60vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
}

#partieDroite {
  width: 35vw;
  display: flex;
  flex-direction: column;
  height: 100%;
}

#fiche {
  background-color: #2f363c;
  display: flex;
  padding: 3%;
  flex-grow: 1;
  height: 70%;
  flex-flow: column wrap;
  justify-content: space-evenly;
  align-content: center;
  font-size: 150%;
}

.attribut {
  display: flex;
  width: 100%;
}

.nom {
  min-width: 122px;
  margin: 0px 10px;
  color: #bbbbbb;
}

#description {
  height: 35%;
  display: flex;
  flex-direction: column;
}

.text {
  background-image: url("input.png");
  color: $content;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: contain;
  flex-grow: 1;
  margin: 0px 10px;
  text-align: center;
  font-size: 35px;
  overflow: scroll;
}

.text .text-fill,
#force .text .text-fill {
  width: 90%;
  height: 80%;
  margin: auto;
  text-align: center;
  overflow-y: scroll;
}

#description .text {
  background-image: url("input.png");
  color: $content;
  width: 100%;
  height: 100%;
  font-size: 15px;
  background-position: top;
  background-size: cover;
  align-self: center;
  margin: 0px 10px;
  padding: 8%;
}

.cercle:not(.lock) {
  width: 100px;
  height: 100px;
  margin: 10px;
  border-radius: 500px;
  -webkit-border-radius: 500px;
  -moz-border-radius: 500px;
}

.cercle img:not(.lock) {
  margin: 10px;
  border-radius: 500px;
  -webkit-border-radius: 500px;
  -moz-border-radius: 500px;
}

.cercle.active {
  width: 120px;
  height: 120px;
  opacity: 1;
}

.cercle.active img:not(.lock) {
  width: 120px;
  height: 120px;
  border: 5px solid #fff;
}

.cercle:not(.active) img:not(.lock) {
  width: 100px;
  height: 100px;
  border: 5px solid #808080;
}

.cercle:not(.active) {
  opacity: 0.5;
}

.cercle:not(.active):hover {
  opacity: 1;
  cursor: pointer;
}

.disabled {
  opacity: 0.2;
  filter: grayscale(100%);
  pointer-events: none;
  cursor: default;
}

#boutons {
  display: flex;
  justify-content: center;
}

#prev {
  background-image: url("../../public/Design/prev.png");
}

#next {
  background-image: url("../../public/Design/next.png");
}

#valider {
  background-image: url("../../public/Design/valider.png");
}

#prev,
#next {
  width: 71px;
  background-size: contain;
}

#prev,
#next,
#valider {
  height: 71px;
}

#valider {
  width: 178px;
}

#titre {
  font-size: 70px;
  color: #bbbbbb;
  margin: 0 auto;
  top: 0;
  justify-content: center;
  display: flex;
}

#force {
  font-size: 15px;
  padding-top: 3%;
  padding-bottom: 3%;
}

#content input {
  background-image: url("input.png");
  background-repeat: no-repeat;
  padding-left: 20px;
  font-size: 20px;
  background-size: contain;
  padding: 10px 0px 35px 0px;
}

input:focus {
  outline: none;
}

li {
  list-style: none;
}

ul {
  margin: 20px 0px;
  font-size: 15px;
}

#boutons {
  padding: 20px 0px 0px 0px;
  display: flex;
  justify-content: space-around;
}

#valider {
  background-image: url("../../public/Design/valider.png");
}

@media screen and (max-width: 720px) {
}
</style>
