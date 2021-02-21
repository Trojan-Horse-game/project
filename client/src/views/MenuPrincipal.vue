<template>
  <div id="container">
    <logo title="Les Cavaliers de Troie" />

    <div id="boutons">
      <div id="boutons-partie">
        <v-btn title="Nouvelle partie">Nouvelle partie</v-btn>
        <v-btn title="Rejoindre une partie">Rejoindre une partie</v-btn>

        <div id="boutons-divers">
          <router-link to="/parametres"
            ><v-btn title="Paramètres" x-large icon
              ><v-icon>mdi-cog</v-icon></v-btn
            ></router-link
          >
          <router-link to="/reglesDuJeu">
            <v-btn title="Aide" x-large icon
              ><v-icon>mdi-help-circle</v-icon></v-btn
            ></router-link
          >
          <router-link to="/Profil">
            <v-btn title="Profil" x-large icon
              ><v-icon>mdi-account-box</v-icon></v-btn
            ></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo }
};
</script>

<style lang="css" scoped>
#boutons-divers .v-btn {
  background-color: transparent !important;
}

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#boutons {
  width: 450px;
  display: flex;
  flex-direction: column;
}

#boutons div {
  width: 100%;
  display: flex;
}

#boutons-partie {
  flex-direction: column;
}

#boutons-partie .v-btn {
  margin: 0px 0px 20px 0px;
}

#boutons-divers {
  flex-direction: row;
  justify-content: space-around;
  font-size: 32px;
}
</style>
