<template>
  <v-app>
    <div id="background-image" />
    <div id="container">
      <div id="left">
        <div id="logo">
          <img src="logo.png" alt="Logo du jeu" />
          <span class="min-title">LES CAVALIERS DE TROIE</span>
        </div>
        <div id="buttons">
          <router-link to="/connexion">
            <button id="connexion" />
          </router-link>
          <router-link to="/inscription">
            <button id="inscription" />
          </router-link>
        </div>
      </div>
      <div id="right">
        <span class="min-title">LES CAVALIERS DE TROIE</span>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}

#logo {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  text-align: center;
  align-self: baseline;
}

.min-title {
  width: 100%;
  padding: 2%;
  color: #fff;
  display: block;
  font-size: 400%;
  font-family: "Gagalin", sans-serif !important;
  text-shadow: 4px 4px rgb(83, 82, 85);
  text-align: center;
}

#left .min-title {
  display: none;
}

#logo img {
  width: 70% !important;
  height: auto;
}

#background-image {
  background-image: url("../../public/Design/begin.gif");
}

#container {
  padding-right: 10%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  height: 100%;
  width: 100%;
}

#left {
  height: 100%;
  width: 100%;
  align-content: center;
  display: grid;
  justify-content: center;
  grid-template-rows: 1fr 1fr;
}

#right {
  height: 100%;
  width: 100%;
  padding-top: 6%;
}

#buttons {
  margin: auto;
  text-align: center;
  align-items: center;
  height: 70%;
  width: 100%;
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

@media screen and (max-width: 1024px) {
  #background-image {
    background-image: url("../../public/Design/default-bck.gif");
  }

  #right {
    display: none;
  }

  #container {
    display: block;
  }

  #left {
    height: 100%;
    width: 100%;
    align-content: center;
    display: grid;
    grid-template-rows: 1fr 1fr;
  }

  #logo img {
    width: 70% !important;
    height: auto;
  }

  .min-title {
    padding: 2%;
    color: #fff;
    display: block;
    font-size: 400%;
    font-family: "Gagalin", sans-serif !important;
    text-shadow: 4px 4px rgb(83, 82, 85);
  }

  #right .min-title {
    display: none;
  }
}

@media screen and (max-width: 1024px) {
  .min-title {
    padding: 2%;
    color: #fff;
    display: block;
    font-size: 300%;
    font-family: "Gagalin", sans-serif !important;
    text-shadow: 4px 4px rgb(83, 82, 85);
  }

  #right .min-title {
    display: none;
  }

  #container {
    padding-right: 0;
  }

  #container{
    padding-right:0;
  }

  #container{
    padding-right:0;
  }
}
</style>

<style lang="css" src="../assets/scss/index.css"></style>