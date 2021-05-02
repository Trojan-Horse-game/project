<template>
  <v-app>
    <div id="background-image" />
    <Logo />
    <div id="container">
      <span id="titre">Inscription</span>

      <div id="content">
        <table id="infos">
          <tr>
            <td>Nom</td>
            <td>
              <input color="#000" v-model="user.lastName" />
            </td>
          </tr>

          <tr>
            <td>Prénom</td>
            <td>
              <input color="#000" v-model="user.firstName" />
            </td>
          </tr>

          <tr>
            <td>Username</td>
            <td>
              <input color="#000" v-model="user.username" />
            </td>
          </tr>

          <tr>
            <td>Adresse mail</td>
            <td>
              <input type="email" color="#000" v-model="user.mail" />
            </td>
          </tr>
          <tr>
            <td>Mot de passe</td>
            <td>
              <input type="password" color="#000" v-model="user.password" />
            </td>
          </tr>
        </table>

        <div id="legal">
          <ul>
            <li>
              L'adresse mail et le mot de passe servent à la connexion et seront
              cryptés.
            </li>
            <li>
              La question de sécurité et sa réponse servent à la
              réinitialisation du mot de passe.
            </li>
            <li>
              Un enfant de moins de 15 ans doit avoir l'accord de son
              représentant légal pour l'envoi de données personnelles.
            </li>
            <li>Le reste des données sert à la personnalisation du compte.</li>
          </ul>

          <v-checkbox
            v-model="checkbox"
            label="J'accepte les termes"
            color="#bbbbbb"
          />
        </div>

        <div id="buttons">
          <router-link to="/menuPrincipal">
            <button id="retour" />
          </router-link>
          <v-btn id="valider" @click="submitForm()" />
        </div>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Logo from "../components/Logo.vue";
export default {
  components: { Logo: Logo },
  data: () => ({
    user: {
      username: "",
      password: "",
      lastName: "",
      firstName: "",
      mail: ""
    },
    mailPattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    checkbox: false
  }),

  methods: {
    submitForm() {
      const errors = [];

      if (this.user.lastName.length < 1) {
        errors.push("Nom requis");
      }

      if (this.user.firstName.length < 1) {
        errors.push("Prénom requis");
      }
      if (this.user.username.length < 1) {
        errors.push("Username requis");
      }

      if (this.user.mail.length < 1) {
        errors.push("Mail requis");
      } else if (!this.mailPattern.test(this.user.mail)) {
        errors.push("Adresse mail invalide");
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
  width: max-content;
  height: max-content;
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
}

input:focus {
  outline: none;
}

table {
  width: 100%;
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
  align-items: flex-start;
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
