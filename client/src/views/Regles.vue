<template>
  <v-app>
    <div id="background-image" />
    <div id="container">
      <logo title="Règles du jeu" />

      <div id="rules">
        <v-carousel v-model="nbPage">
          <v-carousel-item>
            <div class="regle">
              <span class="titre">
                Principe de jeu
              </span>
              <div class="contenu">
                <p>
                  Le but du jeu est de constituer sa base composé de 4
                  générateurs sains: Air, Energie, Eau et Antiradiation.Eh oui,
                  dans le jeu on reprend les éléments essentiels à la vie.
                </p>
                <p>
                  Il existe quatre types de cartes, les générateurs, les
                  pare-feux, les virus et les cartes d'action. Les trois
                  premiers types de cartes existent en quatre couleurs
                  différentes et ne peuvent affecter que des cartes de leurs
                  couleurs.
                </p>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </div>

      <router-link to="/menuPrincipal">
        <v-btn>Retour</v-btn>
      </router-link>
    </div>
  </v-app>
</template>

<script>
import Logo from "../components/Logo";
export default {
  components: { Logo: Logo },
  data: () => ({
    nbPage: 0
  }),
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
  }
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
