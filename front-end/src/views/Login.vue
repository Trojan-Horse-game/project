<template>
  <div id="container">
    <div id="logo">
      <img src="logo.png" alt="Logo du jeu" />
    </div>
    <div id="inputs">
      <v-text-field color="#fff" dark label="Adresse mail" />
      <v-text-field color="#fff" dark label="Mot de passe" />
    </div>
    <div id="boutons">
      <router-link to="/"> <v-btn>Retour</v-btn></router-link>
      <router-link to="/menuPrincipal"><v-btn>Valider</v-btn></router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="css" src="../assets/scss/login.css"></style>
