<template>
  <v-app>
    <div id="background-image" />
    <div id="container">
        <logo title="Paramètres" />
        <v-switch :v-model="sound" label="Son" color="#12b886" hide-details />
        <router-link to="/menuPrincipal">
          <button id="retourmenu"/>
        </router-link>
      </div>
  </v-app>
</template>

<script>
import Logo from "../components/Logo";

export default {
  components: { Logo: Logo },
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
    // this.$socket.emit("gameState");
  },
  methods:{
    async createGame() {
      try {
        this.$socket.emit("create game", (localStorage.getItem("username")));
        this.$router.push("/choixEspece");
      } catch (err) {
        console.log(err);
      }
    }
  },
  sockets: {
    oops : function(error) {
      alert(error);
    },
    closeTab : function() {
      this.$router.push("/menuPrincipal");
    },
    inGame : function() {
      this.$router.push("/Jeu");
    }
  }
};
</script>
<script>
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo },
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
  },
  data: () => ({
    sound: true
  })
};
</script>

<style lang="css" scoped src="../assets/scss/index.css"></style>
<style lang="css" scoped>

#app {
  width: 100vw;
  height: 100vh;
}

#logo img {
  width: 20vw;
  height: auto;
}

#background-image {
  background-image: url("../../public/Design/fond_parametres.gif");
}

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#buttons {
  width: 25%;
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
  margin: 5%;
  height: 50px;
  width: auto;
}

#retourmenu {
 background-image: url("../../public/Design/retour_menu.png");
}

#buttons img {
  filter: grayscale(100%);
}
</style>
