<template>
  <v-app>
    <div id="container">
      <div id="background">
        <img src="Design/MenuPrincipal.gif" usemap="#image-map" />
        <map name="image-map">
          <router-link to="#">
            <area
              target="_self"
              alt="Lancer une partie"
              title="Lancer une partie"
              coords="554,298,848,405"
              shape="rect"
            />
          </router-link>
          <router-link to="#">
            <area
              target="_self"
              alt="Rejoindre une partie"
              title="Rejoindre une partie"
              coords="554,461,848,569"
              shape="rect"
            />
          </router-link>
          <router-link to="/parametres">
            <area
              target="_self"
              alt="Paramètres"
              title="Paramètres"
              coords="584,664,34"
              shape="circle"
            />
          </router-link>
          <router-link to="/reglesDuJeu">
            <area
              target="_self"
              alt="Règles du jeu"
              title="Règles du jeu"
              coords="689,664,33"
              shape="circle"
            />
          </router-link>
          <router-link to="/Profil">
            <area
              target="_self"
              alt="Profil"
              title="Profil"
              coords="796,663,33"
              shape="circle"
            />
          </router-link>
        </map>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
#background img {
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
