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
          <button id="connexion">Connexion</button>
        </router-link>
        <router-link to="/inscription">
          <button id="inscription">Inscription</button>
        </router-link>
      </div>
      <div id="titre">
        <span>Les Cavaliers de Troie</span>
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
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  -ms-touch-action: none;
  touch-action: none;
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
  font-size: 35px;
}

#connexion {
  background-image: url("../../public/Design/boutin_connexion.png");
  padding: 0px 15px 20px 25px;
}

#inscription {
  background-image: url("../../public/Design/bouton_inscription.png");
  padding: 0px 15px 20px 30px;
  color: #000;
}

#titre {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#titre span {
  margin: 5% 0% 0% 0%;
  max-width: max-content;
  max-height: max-content;
  font-size: 50px;
  text-shadow: 4px 4px #636261;
}
</style>

<style lang="css" src="../assets/scss/index.css"></style>
