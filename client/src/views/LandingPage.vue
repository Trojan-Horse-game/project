<template>
  <v-app>
    <div id="background-image" />

    <div id="container">
      <div id="buttons">
        <div id="logo">
          <div id="image">
            <img src="logo.png" alt="Logo du jeu" />
          </div>
        </div>
        <router-link to="/connexion">
          <button id="connexion" />
        </router-link>
        <router-link to="/inscription">
          <button id="inscription" />
        </router-link>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}

#logo img {
  width: 20vw;
  height: auto;
}

#background-image {
  background-image: url("../../public/Design/Home.gif");
}

#container {
  display: flex;
  flex-direction: row;
}

#logo {
  margin: 0% 0% 10% 0%;
}

#buttons {
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  width: max-content;
  height: 100vh;
  width: 20vw;
  margin: 6% 0% 0% 2%;
}

#buttons button {
  width: 300px;
  height: 123px;
  background-size: contain;
}

#connexion {
  background-image: url("../../public/Design/connexion.png");
}

#inscription {
  background-image: url("../../public/Design/inscription.png");
}
</style>

<style lang="css" src="../assets/scss/index.css"></style>
