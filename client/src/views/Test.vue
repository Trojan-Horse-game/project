<template>
  <v-app>
    <div
      id="background-image"
      :class="{
        fawkes: selected.name == 'fawkes',
        hutex: selected.name == 'hutex',
        robot: selected.name == 'robot',
        spectre: selected.name == 'spectre',
        totox: selected.name == 'totox',
        xmars: selected.name == 'xmars'
      }"
    />
    <div id="logo">
      <img src="logo.png" alt="Logo du jeu" />
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
            :class="[{ active: selected.name == 'robot' }, 'cercle']"
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
            <span class="attribut">
              <span class="nom">Espèce</span>
              <span class="text">{{ selected.name }}</span>
            </span>

            <span class="attribut">
              <span class="nom">Origine</span>
              <span class="text">{{ selected.origin }}</span>
            </span>

            <span class="attribut">
              <span class="nom">Force</span>
              <span class="text">{{ selected.strength }}</span>
            </span>

            <span class="attribut" id="description">
              <span class="nom">Description</span>
              <span class="text">{{ selected.description }}</span>
            </span>
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
export default {
  data: () => ({
    species: [
      {
        name: "fawkes",
        origin: "Placeholder",
        strength: "Placeholder",
        description: "Placeholder"
      },
      {
        name: "hutex",
        origin: "Placeholder",
        strength: "Placeholder",
        description: "Placeholder"
      },
      {
        name: "robot",
        origin: "Placeholder",
        strength: "Placeholder",
        description: "Placeholder"
      },
      {
        name: "spectre",
        origin: "Placeholder",
        strength: "Placeholder",
        description: "Placeholder"
      },
      {
        name: "totox",
        origin: "Placeholder",
        strength: "Placeholder",
        description: "Placeholder"
      },
      {
        name: "xmars",
        origin: "Placeholder",
        strength: "Placeholder",
        description: "Placeholder"
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
    },

    changeChoice() {
      this.lockedChoices = this.lockedChoices.filter(
        speciesName => speciesName != this.lockedSpecies
      );
      this.lockedSpecies = null;
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
  }
};
</script>

<style lang="scss" scoped>
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
  width: 200px !important;
  height: auto;
}

#container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#content {
  width: 100vw;
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
  background-color: #fff;
  display: flex;
  flex-grow: 1;
  height: 80%;
  flex-flow: column wrap;
  justify-content: space-evenly;
  align-content: center;
  font-size: 40px;
}

.attribut {
  display: flex;
  width: 100%;
}

.nom {
  min-width: 122px;
  margin: 0px 10px;
}

#description {
  height: 35%;
  display: flex;
  flex-direction: column;
}

.text {
  background-image: url("../../public/Design/test_big.png");
  color: #fff;
  width: 100%;
  background-size: contain;
  background-position: center;
  flex-grow: 1;
  margin: 0px 10px;
  text-align: center;
  font-size: 35px;
}

#description .text {
  background-image: url("../../public/Design/description_test.png");
  color: #fff;
  width: 98%;
  height: 100%;
  background-position: top;
  background-size: contain;
  margin: 0px 10px;
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

table {
  width: 100%;
}

tr td:nth-child(1) {
  vertical-align: top;
  padding-top: 9px;
  width: max-content;
}

td {
  text-align: center;
  vertical-align: middle;
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
</style>
