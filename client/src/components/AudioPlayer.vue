<template>
  <div id="audioplay" :class="$route.name == 'Jeu' ? 'bottom' : 'right'">
    <audio ref="player" autoplay loop>
      <source :src="audioFile" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <div id="controls">
      <button id="playButton" v-if="!playing" @click="playing = true">
        <v-icon>mdi-play-circle-outline </v-icon>
      </button>
      <button id="pauseButton" v-else @click="playing = false">
        <v-icon>mdi-pause-circle-outline </v-icon>
      </button>
      <button id="volumeButton" @click="showSlider = !showSlider">
        <v-icon>mdi-volume-high</v-icon>
      </button>
      <v-slider
        color="#6131e0"
        track-color="#fff"
        v-show="showSlider"
        v-model="volume"
        vertical
        inverse-label
        max="1"
        min="0"
        step="0.01"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data: () => ({ showSlider: false, volume: 0.15, playing: false }),

  mounted: function() {
    this.$watch("audioFile", () => {
      this.$refs.player.load();
      this.$refs.player.volume = 0.15;
      this.$refs.player.play();
    });

    this.$watch("playing", function() {
      if (this.playing) {
        this.$refs.player.play();
      } else {
        this.$refs.player.pause();
      }
    });

    this.$watch("volume", function() {
      this.$refs.player.volume = this.volume;
    });
  },

  computed: {
    audioFile: function() {
      return this.$route.name == "Jeu"
        ? "audio/plateau.mp3"
        : "audio/musique.mp3";
    }
  },

  methods: {
    play: function() {
      this.$refs.player.play();
    }
  }
};
</script>

<style lang="scss" scoped>
#audioplay {
  position: fixed;
  right: 0;
  z-index: 50;
}

.bottom {
  bottom: 0;
}

.bottom > #controls {
  display: block;
  height: 5%;
}

#controls {
  display: flex;
  flex-direction: column;
  height: 300px;
}
#controls button {
  height: 50px;
  width: 50px;
}

#controls .theme--light.v-icon {
  color: #fff !important;
}

#controls .v-input {
  display: flex;
  align-items: center;
}

.v-input__slot {
  height: 50px !important;
}
</style>
