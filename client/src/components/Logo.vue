<template>
  <div id="logo">
    <div id="image">
      <img src="logo.png" alt="Logo du jeu" />
    </div>

    <span class="titre">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
#logo img {
  width: 300px;
  height: auto;
}

#logo {
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.titre {
  margin: 5px 0px;
}
</style>
