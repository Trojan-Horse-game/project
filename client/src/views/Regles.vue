<template>
  <div id="container">
    <logo title="Règles du jeu" />
    <div id="texte">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dui odio,
      tempor eu commodo a, sodales eget tortor. Proin suscipit turpis vel arcu
      ullamcorper, et maximus lacus venenatis. Nunc vehicula tellus at nisi
      mattis rhoncus. Integer quis bibendum magna, id sagittis justo. Nulla
      condimentum placerat ipsum, sed commodo eros dictum non. In posuere magna
      nec aliquam sagittis. Aenean ultricies ligula id scelerisque cursus. Fusce
      tempus nunc a augue hendrerit vestibulum. Curabitur at erat sit amet
      ligula hendrerit fermentum vel ac nisi. Donec eget eros tempus, laoreet
      tortor eget, dignissim dui. In eu venenatis mauris, eu mollis metus.
      <br /><br />
      Integer augue nunc, laoreet condimentum placerat nec, mollis sed libero.
      Aliquam sit amet elementum eros. In hac habitasse platea dictumst. Morbi
      vel sem in ligula congue sagittis. Donec consequat semper tempus. Interdum
      et malesuada fames ac ante ipsum primis in faucibus. Nunc venenatis nibh
      eu mi bibendum congue. Aenean erat quam, pulvinar quis molestie at,
      ultricies eu massa. Pellentesque habitant morbi tristique senectus et
      netus et malesuada fames ac turpis egestas. Aenean ut nisl eget turpis
      aliquet ornare. Suspendisse eu lacus accumsan, aliquet turpis et,
      ultricies dui. Curabitur non pulvinar nulla. Curabitur non urna et risus
      venenatis molestie. Sed in facilisis est. Morbi sed mi iaculis, pharetra
      leo tincidunt, faucibus erat. Mauris ultricies leo et nulla lobortis
      tristique.
    </div>

    <router-link to="/menuPrincipal">
      <v-btn title="Retour au menu principal">Retour au menu principal</v-btn>
    </router-link>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo }
};
</script>

<style lang="css" scoped src="../assets/scss/index.css"></style>
<style lang="css" scoped>
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#texte {
  width: 80vw;
}

.v-btn {
  margin: 20px 0px 0px 0px;
}
</style>
