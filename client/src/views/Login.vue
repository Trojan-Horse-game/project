<template>
  <v-app>
    <div id="background-image"/>
      <div id="logo">
      <img src="logo.png" alt="Logo du jeu" />
    </div>
    <div id="container">
      <span id="titre">Connexion</span>

      <div id="content">
        <div id="infos">

          <div class="row">
            <label>Username</label>
            <div class="form_input">
              <input color="#000" v-model="user.username" />
            </div>
          </div>

          <div class="row">
            <label>Mot de passe</label>
            <div class="form_input">
              <input type="password" color="#000" v-model="user.password" />
            </div>
          </div>
        </div>
      </div>

      <div id="buttons">
        <router-link to="/">
          <v-btn id="retour" />
        </router-link>
        <v-btn id="valider" @click="submitForm()" />
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  components: { },
  data: () => ({
    validInput: false,
    showError: false,
    user: {
      username: "",
      password: ""
    }
  }),

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },

  created() {
    if (this.loggedIn) {
      this.$router.push("/menuPrincipal");
    }
  },

  methods: {
    submitForm() {
      const errors = [];

      if (this.user.username.length < 1) {
        errors.push("Username requis");
      }

      if (this.user.password.length < 1) {
        errors.push("Mot de passe requis");
      }

      if (errors.length != 0) {
        let alertMessage = errors.length > 1 ? "Erreurs\n" : "Erreur:\n";
        for (const error of errors) {
          alertMessage += `\t${error}\n`;
        }

        alert(alertMessage);
      } else {
        this.$store.dispatch("auth/signin", this.user).then(
          () => {
            this.$router.push("/menuPrincipal");
          },
          error => {
            alert(error);
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$textColor: #bbbbbb;
$content: #2f363c;

#background-image {
  background-image: url("../../public/Design/default-bck.gif");
  min-width:100%;
  min-height: 100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

#logo {
  position: absolute;
  top: 1%;
  left: 1%;
}

#logo img {
  width: 20% !important;
  height: auto;
}

#container {
  width: 100%;
  height: 100%;
  margin:auto;
  text-align:center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#content {
  width: max-content;
  height: max-content;
  padding: 2%;
  z-index: 0;
  color: $textColor;
  background-color: $content;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: center;
  font-size: 25px;
  justify-content: space-around;
  margin: 2% 0%;

}

#content > div {
  width: max-content;
}

#titre {
  font-size: 400%;
  color: $textColor;
  text-align:center;
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
  margin:auto;
  text-align:center;
}

input:focus {
  outline: none;
}


#infos {
  width: 50%;
  display:grid;
}

.row {
  display:block;
  text-align: center;
}

.theme--light.v-label {
  color: rgba(0, 0, 0, 0.6) !important;
}

li {
  list-style: none;
}

ul {
  margin: 20px 0px;
  font-size: 15px;
}

#buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 20%;
}
#buttons button {
  height: 69px;
  width: 178px;
}
#retour {
  background-image: url("../../public/Design/retour.png");
}

#valider {
  background-image: url("../../public/Design/valider.png");
}

#legal {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.v-label {
  font-size: 25px !important;
}
</style>

<style scoped lang="css" src="../assets/scss/index.css"></style>
