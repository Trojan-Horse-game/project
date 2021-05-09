<template>
  <v-app>
    <div id="container">
      <logo title="Rejoindre une partie" />
      <div id="join">
        <v-text-field dark label="ID de la partie" color="#fff" v-model="id" />
        <v-btn :disabled="id.length == 0">Rejoindre la partie</v-btn>
      </div>
      <router-link to="/menuPrincipal">
        <v-btn title="Retour au menu principal">Retour au menu principal</v-btn>
      </router-link>
    </div>
  </v-app>
</template>

<script>
// Appeler la fonction "joinGame" puis rediriger vers la page choix espece
// gameScene.joinGame()
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo },
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
  },
  data: () => ({
    id: ""
  })
};
</script>

<style lang="css" scoped>
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-btn {
  margin: 20px 0px 0px 0px;
}

.theme--light.v-input input {
  color: #fff !important;
}
</style>
<style lang="css" scoped src="../assets/scss/index.css"></style>
