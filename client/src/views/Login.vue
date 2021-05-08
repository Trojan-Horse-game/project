<template>
  <v-app>
    <div id="background-image" />
    <Logo />
    <div id="container">
      <span id="titre">Connexion</span>

      <div id="content">
        <table id="infos">
          <tr>
            Username
          </tr>
          <tr>
            <input color="#000" v-model="user.username" />
          </tr>

          <tr>
            Mot de passe
          </tr>
          <tr>
            <input type="password" color="#000" v-model="user.password" />
          </tr>
        </table>
      </div>

      <div id="buttons">
        <router-link to="/landingPage">
          <button id="retour" />
        </router-link>
        <v-btn id="valider" @click="submitForm()" />
      </div>
    </div>
  </v-app>
</template>

<script>
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo },
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
}

#logo {
  position: absolute;
  top: 1%;
  left: 1%;
}

#logo img {
  width: 250px;
  height: auto;
}

#container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#content {
  width: 50%;
  height: 50%;
  padding: 5%;
  z-index: 0;
  color: $textColor;
  padding: 5px 10px;
  background-color: $content;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: center;
  font-size: 25px;
  justify-content: space-around;
  margin: 2% 0%;
}

#content > table {
  font-size: 40px;
}

#content > div {
  width: max-content;
}

#titre {
  font-size: 70px;
  color: $textColor;
  margin: 0 auto;
  margin-top: 1%;
  position: fixed;
  top: 0;
}

#content input {
  background-image: url("input.png");
  background-repeat: no-repeat;
  padding-left: 20px;
  font-size: 20px;
  background-size: contain;
  padding: 10px 0px 35px 0px;
  width: 50%;
}

input:focus {
  outline: none;
}

table {
  width: 100%;
  text-align: center;
}

tr td:nth-child(1) {
  vertical-align: top;
  padding-top: 9px;
  width: max-content;
}

td {
  text-align: center;
  vertical-align: middle;
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
  align-items: flex-end;
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
