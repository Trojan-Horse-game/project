<template>
  <v-app>
    <div id="background-image" />
    <div id="container">
      <logo title="Menu principal" />
      <router-link to="/choixEspece"><button id="lancer"/></router-link>
      <router-link to="/rejoindrePartie"><button id="rejoindre"/></router-link>

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
/*
- Importer le fichier GameScene
- Créer une instance de GameScene :
  gameScene = new GameScene();
  la scène sera accessible par gameScene.scene

- si le joueur choisit de créer une partie, appeler la fonction "createGame(pseudo, Specie)"
- Sinon appeler "joinGame(pseudo)" puis "chooseSpecie(specie) quand il aura choisit son espèce"

La liste des espèces disponibles est stockée dans l'attribut gameScene.availableSpecies
Libre a toi d'appeler les méthodes dans les bons fichiers mais à première vue je dirai de créer l'instance GameScene dans menuPrincipal.vue et appeler gameScene.scene dans Game.vue
*/

import Logo from "../components/Logo";
import { GameScene } from "../../game-interface/src/GameScene";

export default {
  components: { Logo: Logo },
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
  },

  mounted: function() {
    try {
    await this.getUserInfos();
    this.game = new GameScene(this.username);
    }

    catch(errors) {
      alert(errors);
    }
  },

  data: () => ({
    game: null,
    username: null
  }),

  methods: {
    async getUserInfos() {
      const myUserId = this.getMyUserId();
      const url = `${this.apiUrl}/users/${myUserId}`;

      try {
        const response = await axios.get(url);
        const userInfos = response.data;

        this.username = userInfos.username;
      } catch (errors) {
        console.error(errors);
      }
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
