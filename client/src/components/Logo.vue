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
  width: 450px;
  height: auto;
}

#logo {
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
