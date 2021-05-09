<template>
  <v-app>
    <div id="container">
      <logo title="Paramètres" />
      <v-switch :v-model="sound" label="Son" color="#12b886" hide-details />
      <router-link to="/menuPrincipal">
        <v-btn title="Retour au menu principal">Retour au menu principal</v-btn>
      </router-link>
    </div>
  </v-app>
</template>

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
</style>
