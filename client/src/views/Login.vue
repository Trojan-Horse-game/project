<template>
  <div id="container">
    <logo titre="Connexion" />
    <div id="inputs">
      <v-form v-model="validInput" @submit.prevent="login()"
        ><v-text-field
          color="#fff"
          dark
          label="Nom d'utilisateur"
          v-model="user.username"
        />
        <v-text-field
          :type="'password'"
          color="#fff"
          dark
          label="Mot de passe"
          v-model="user.password"
        />
        <p v-if="showError" class="error--text">
          Le nom utilisateur ou le mot de passe sont incorrects.
        </p>
        <div id="buttons">
          <router-link to="/nouveauCompte">
            <v-btn title="Inscription">Inscription</v-btn></router-link
          >
          <v-btn title="Valider" type="submit" :disabled="!this.validInput"
            >Valider</v-btn
          >
        </div></v-form
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
    login() {
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

<style scoped lang="css" src="../assets/scss/login.css"></style>
