<template>
  <v-app>
    <div id="background-image" />
    <div id="container">
      <logo title="Règles du jeu" />
      <router-link to="/menuPrincipal">
        <v-btn>Retour</v-btn>
      </router-link>
    </div>
  </v-app>
</template>

<script>
import Logo from "../components/Logo";
export default {
  components: { Logo: Logo }
};
</script>
<style scoped>
#background-image {
  background-image: url("../../public/Design/default-bck.gif");
}

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="css" src="../assets/scss/index.css"></style>
