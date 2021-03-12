<template>
  <div id="container">
    <logo titre="Connexion" />
    <div id="inputs">
      <v-form v-model="validInput" @submit.prevent="login()"
        ><v-text-field
          color="#fff"
          dark
          label="Nom d'utilisateur"
          v-model="form.username"
        />
        <v-text-field
          :type="'password'"
          color="#fff"
          dark
          label="Mot de passe"
          v-model="form.password"
        />
        <p v-if="showError" class="error--text">
          Le nom utilisateur ou le mot de passe sont incorrects.
        </p>
        <div id="buttons">
          <router-link to="/nouveauCompte">
            <v-btn title="Inscription">Inscription</v-btn></router-link
          >
          <router-link to="/menuPrincipal"
            ><v-btn title="Valider" type="submit" :disabled="!this.validInput"
              >Valider</v-btn
            ></router-link
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
    form: {
      username: "",
      password: ""
    }
  }),

  methods: {}
};
</script>

<style scoped lang="css" src="../assets/scss/login.css"></style>
