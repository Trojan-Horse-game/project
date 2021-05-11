<template>
  <v-app>
    <div id="background-image" />
      <router-link to="/menuPrincipal">
      <div id="logo">
        <img src="logo.png" alt="Logo du jeu" />
      </div>
    </router-link>
    <div id="container">
      <span id="titre">REJOINDRE UNE PARTIE</span>
      <div id="content">
        <div class="form_input">
          <input placeholder="Id de la partie" color="#000" v-model="id" />
        </div>
      <div id="boutons">
        <router-link to="/menuPrincipal">
          <button id="retour"></button>
        </router-link>
        <button  id="valider" @click="joinGame()"></button>
      </div>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  components: {},
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
  },
  data: () => ({
    id: "",
  }),
  // sockets: {
  //   async joinGame() {
  //     try {
  //       if(this.id.length > 0){
  //         this.$sockets.emit("join game", localStorage.getItem("username"), this.id);
  //       }
  //       else{
  //         throw "Id de la partie requis";
  //       }
  //     } catch (err) {
  //       alert(err);
  //     }
  //   }
  // }
};
</script>

<style lang="scss" scoped>
$textColor: #bbbbbb;
$content: #2f363c;

#container {
  width: 60%;
  height: 100%;
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10% auto; 
}

#titre {
  font-size: 400%;
  color: $textColor;
  text-align: center;
}

#background-image {
  background-image: url("../../public/Design/default-bck.gif");
}

#boutons {
  padding: 20px 0px 0px 0px;
  display: flex;
  justify-content: space-around;
}

#content {
  width: inherit;
  height: max-content;
  padding: 2%;
  z-index: 0;
  color: $textColor;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: center;
  font-size: 25px;
  justify-content: space-around;
  margin: 2% 0%;
}

#content .form_input {
  background-image: url("input.png");
  background-repeat: no-repeat;
  padding-left: 20px;
  font-size: 20px;
  background-size: contain;
  padding: 10px 0px 35px 0px;
}

.form_input input {
  width: 90%;
  margin: auto;
  text-align: center;
}

input:focus {
  outline: none;
}

#logo {
  width: 20%;
  position: fixed;
  top: 1%;
  left: 1%;
  margin-right: 5%;
}

#logo img {
  width: 100% !important;
  height: auto;
}

#retour, #valider {
  margin: 0px 20px 20px 20px;
  width: 178px;
  height: 71px;
  background-size: contain;
  background-color:none;
}

#retour {
  background-image: url("../../public/Design/retour.png");
}

#valider {
  background-image: url("../../public/Design/valider.png");
}

.theme--light.v-input input {
  color: #fff !important;
}
</style>
<style lang="css" scoped src="../assets/scss/index.css"></style>
