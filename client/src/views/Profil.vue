<template>
  <div id="container">
    <logo title="Mon profil" />
    <ul>
      <li>Nom: {{ lastName }}</li>
      <li>Prénom: {{ firstName }}</li>
      <li>Username: {{ username }}</li>
      <li>Adresse mail: {{ mail }}</li>
      <li>Nombre de victoires: {{ nbVictories }}</li>
      <li>Nombre de défaites: {{ nbDefeats }}</li>
    </ul>
    <router-link to="/menuPrincipal">
      <v-btn title="Retour au menu principal">Retour au menu principal</v-btn>
    </router-link>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo },
  props: {
    lastName: {
      type: String,
      default: "Dorian"
    },

    firstName: {
      type: String,
      default: "Arno"
    },
    username: {
      type: String,
      default: "frenchAssassin"
    },
    mail: {
      type: String,
      default: "frenchAssassin@outlook.com"
    },
    nbVictories: {
      type: Number,
      default: 10
    },
    nbDefeats: {
      type: Number,
      default: 2
    }
  },

  data: () => ({})
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

li {
  list-style: none;
}

ul {
  margin: 20px 0px;
}
</style>
