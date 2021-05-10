<template>
  <v-app>
    <div id="background-image" />
    <div id="container">
      <logo title="Menu principal" />
      <router-link :to="{ name: 'Choix espèce', params: { game, player } }"
        ><button id="lancer"
      /></router-link>
      <router-link :to="{ name: 'Rejoindre partie', params: { game, player } }"
        ><button id="rejoindre"
      /></router-link>

      <div id="buttons">
        <router-link to="/reglesDuJeu">
          <img src="../../public/Design/regles.png" alt="Règles du jeu" />
        </router-link>
        <router-link to="/Profil">
          <img src="../../public/Design/profil.png" alt="Profil" />
        </router-link>
      </div>
    </div>
  </v-app>
</template>

<script>
import Logo from "../components/Logo";
import { GameScene, Player } from "../../game-interface/src/GameScene";

export default {
  components: { Logo: Logo },
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }

    this.username = localStorage.getItem("username");
    this.player = new Player(this.username, this.species);
    this.game = new GameScene(this.player);
  },

  data: () => ({
    species: "",
    username: "",
    player: null,
    game: null
  }),

  watch: {
    username: function() {
      this.player = new Player(this.username, this.species);
    },

    species: function() {
      this.player = new Player(this.username, this.species);
    },

    player: function() {
      this.game = new GameScene(this.player);
    }
  }
};
</script>
<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}

#logo img {
  width: 20vw;
  height: auto;
}

#background-image {
  background-image: url("../../public/Design/default-bck.gif");
}

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#buttons {
  width: 10vw;
  display: flex;
  justify-content: space-evenly;
  margin: 2% 0% 0% 0%;
}

#container button {
  width: 300px;
  height: 123px;
  background-size: contain;
  margin: 2% 0% 0% 0%;
}

#buttons img {
  height: 50px;
  width: auto;
}

#lancer {
  background-image: url("../../public/Design/lancer_partie.png");
}

#rejoindre {
  background-image: url("../../public/Design/rejoindre_partie.png");
}

#buttons img {
  filter: grayscale(100%);
}
</style>
