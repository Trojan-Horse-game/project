<template>
  <div id="container">
    <div id="logo">
      <img src="logo.png" alt="Logo du jeu" />
    </div>
    <div id="inputs">
      <v-form :v-model="inputValide"
        ><v-text-field
          color="#fff"
          dark
          label="Nom d'utilisateur"
          :v-model="nomUtilisateur"
          :rules="reglesNomUtilisateur"/>
        <v-text-field
          color="#fff"
          dark
          label="Adresse mail"
          :v-model="mail"
          :rules="reglesMail"/>
        <v-text-field
          :type="'password'"
          color="#fff"
          dark
          label="Mot de passe"
          :v-model="motDePasse"
          :rules="reglesMotDePasse"
      /></v-form>
    </div>
    <div id="boutons">
      <router-link to="/Login"> <v-btn>Connexion</v-btn></router-link>
      <router-link
        to="/menuPrincipal"
        :class="{ 'lien-desactive': !this.inputValide }"
        ><v-btn :disabled="!this.inputValide">Valider</v-btn></router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    reglesMail: [
      (mail) => !!mail || "Adresse mail requise",
      (mail) => {
        const mailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return mailPattern.test(mail) || "Adresse mail invalide";
      }
    ],

    reglesMotDePasse: [
      (motDePasse) => !!motDePasse || "Mot de passe requis",
      (motDePasse) =>
        motDePasse.length >= 8 ||
        "Le mot de passe doit faire au moins 8 caractères"
    ],
    reglesNomUtilisateur: [
      (nomUtilisateur) => !!nomUtilisateur || "Nom utilisateur requis",
      (nomUtilisateur) => {
        const usernamePattern = /^[\w]{2,32}$/;
        return (
          usernamePattern.test(nomUtilisateur) ||
          "Le nom d'utilisateur doit être compris entre 2 et 32 caractères et accepte les caractères suivants: A-Z a-z 0-9 _"
        );
      }
    ],

    inputValide: false,
    mail: "",
    motDePasse: "",
    nomUtilisateur: ""
  })
};
</script>

<style scoped lang="css" src="../assets/scss/nouveauCompte.css"></style>
