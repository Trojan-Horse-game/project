<template>
  <v-app>
    <div id="background-image" />
    <div id="logo">
      <img src="logo.png" alt="Logo du jeu" />
    </div>
    <div id="container">
      <span id="titre">Inscription</span>

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

        <div id="legal">
          <p>
            Un enfant de moins de 15 ans doit avoir l'accord de son représentant
            légal pour l'envoi de données personnelles.
          </p>

          <v-checkbox
            v-model="checkbox"
            label="J'accepte les termes"
            color="#bbbbbb"
          />
        </div>
      </div>
      <div id="buttons">
        <router-link to="/"><v-btn id="retour"/></router-link>
        <v-btn id="valider" @click="submitForm()" />
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
export default {
  components: {},
  data: () => ({
    user: {
      username: "",
      password: ""
    },
    checkbox: false
  }),

  methods: {
    submitForm() {
      const errors = [];

      if (this.user.username.length < 1) {
        errors.push("Username requis");
      }

      if (this.user.password.length < 1) {
        errors.push("Mot de passe requis");
      }

      if (!this.checkbox) {
        errors.push("Termes non acceptés");
      }

      if (errors.length != 0) {
        let alertMessage = errors.length > 1 ? "Erreurs\n" : "Erreur:\n";
        for (const error of errors) {
          alertMessage += `\t${error}\n`;
        }

        alert(alertMessage);
      } else {
        this.$store.dispatch("auth/signup", this.user).then(
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

#wrap {
  background-image: url("../../public/Design/default-bck.gif");
  min-width: 100%;
  min-height: 100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
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

#container {
  width: 60%;
  height: 100%;
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#content {
  width: inherit;
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

#titre {
  font-size: 400%;
  color: $textColor;
  text-align: center;
}

#content .form_input {
  background-image: url("input.png");
  background-repeat: round;
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

#infos {
  width: 90%;
  display: grid;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: left;
  vertical-align: middle;
  align-content: center;
}

.theme--light.v-label {
  color: rgba(0, 0, 0, 0.6) !important;
}

#buttons {
  width: 100vw;
  height: 20%;
  justify-content: center;
  text-align: center;
}

#buttons button {
  height: 69px;
  width: 178px;
  margin: auto;
  text-align: center;
}

#retour {
  background-image: url("../../public/Design/retour.png");
}

#valider {
  background-image: url("../../public/Design/valider.png");
}

#legal {
  margin: 2px;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#legal p {
  width: 90%;
  font-size: 60%;
}

.v-label {
  font-size: 25px !important;
}

@media screen and (max-width: 1024px) {
  #container {
    width: 90%;
    height: max-content;
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
  }

  .row {
    width: 100%;
    display: block;
    text-align: center;
  }

  #logo {
    width: 20%;
    position: relative;
    top: 1%;
    left: 1%;
    margin-right: 5%;
  }
}
</style>
