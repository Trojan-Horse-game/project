<template>
  <div id="container">
    <logo title="Les Cavaliers de Troie" />

    <div id="buttons">
      <router-link to="nouveauCompte"
        ><v-btn title="Créer un nouveau compte"
          >Créer un nouveau compte</v-btn
        ></router-link
      >
      <router-link to="login"
        ><v-btn title="S'identifier">S'identifier</v-btn></router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo }
};
</script>

<style lang="scss">
@import "../assets/scss/index.css";
</style>
<style scoped lang="css" src="../assets/scss/landingPage.css"></style>
