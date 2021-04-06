<template>
  <div id="container">
    <logo title="Inscription" />
    <div id="inputs">
      <v-form v-model="validInput"
        ><v-text-field
          color="#fff"
          dark
          label="Nom d'utilisateur"
          v-model="username"
          :rules="usernameRules"/>
        <v-text-field
          color="#fff"
          dark
          label="Adresse mail"
          v-model="mail"
          :rules="mailRules"/>
        <v-text-field
          :type="'password'"
          color="#fff"
          dark
          label="Mot de passe"
          v-model="password"
          :rules="passwordRules"
      /></v-form>
    </div>
    <div id="buttons">
      <router-link to="/Login"> <v-btn>Connexion</v-btn></router-link>
      <router-link
        to="/menuPrincipal"
        :class="{ 'disabled-link': !this.validInput }"
        ><v-btn type="submit" :disabled="!this.validInput"
          >Valider</v-btn
        ></router-link
      >
    </div>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";

export default {
  components: { logo: Logo },
  data: () => ({
    validInput: false,
    mail: "",
    password: "",
    username: "",

    mailRules: [
      mail => !!mail || "Adresse mail requise",
      mail => {
        const mailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (mail && mailPattern.test(mail)) || "Adresse mail invalide";
      }
    ],

    passwordRules: [
      password => !!password || "Mot de passe requis",
      password =>
        (password && password.length >= 8) ||
        "Le mot de passe doit faire au moins 8 caractères"
    ],
    usernameRules: [
      username => !!username || "Nom utilisateur requis",
      username => {
        const usernamePattern = /^[\w]{2,32}$/;
        return (
          usernamePattern.test(username) ||
          "Le nom d'utilisateur doit être compris entre 2 et 32 caractères et accepte les caractères suivants: A-Z a-z 0-9 _"
        );
      }
    ]
  }),

  methods: {
    signin() {
      this.showError = false;
      this.$store.dispatch("auth/signin", this.user).then(
        () => {
          this.$router.push("/menuPrincipal");
        },
        error => {
          this.showError = true;
          console.error(error);
        }
      );
    }
  }
};
</script>

<style scoped lang="css" src="../assets/scss/nouveauCompte.css"></style>
