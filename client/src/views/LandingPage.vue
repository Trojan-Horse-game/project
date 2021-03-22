<template>
  <v-app>
    <div id="background">
      <img src="Design/Home.gif" usemap="#image-map" />

      <div id="buttons">
        <map name="image-map">
          <router-link to="nouveauCompte">
            <area
              target="_self"
              alt="Inscription"
              title="Inscription"
              coords="390,544,107,440"
              shape="rect"
            />
          </router-link>

          <router-link to="Login">
            <area
              target="_self"
              alt="Connexion"
              title="Connexion"
              coords="110,599,390,701"
              shape="rect"
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
}
</style>

<style lang="css" src="../assets/scss/index.css"></style>
