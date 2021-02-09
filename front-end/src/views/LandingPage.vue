<template>
  <div id="container">
    <div id="logo">
      <img src="logo.png" alt="Logo du jeu" />
    </div>

    <span id="titre">Les Cavaliers de Troie</span>

    <div id="boutons">
      <router-link to="nouveauCompte"
        ><v-btn>Créer un nouveau compte</v-btn></router-link
      >
      <router-link to="login"><v-btn>S'identifier</v-btn></router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss">
@import "../assets/scss/index.css";
</style>
<style scoped lang="css" src="../assets/scss/landingPage.css"></style>
