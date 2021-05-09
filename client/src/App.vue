<template>
  <div id="appContainer">
    <AudioPlayer />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AudioPlayer from "../src/components/AudioPlayer.vue";

export default Vue.extend({
  name: "App",
  components: { AudioPlayer: AudioPlayer }
});
</script>

<style lang="scss" scoped>
#appContainer {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0;
}
</style>
