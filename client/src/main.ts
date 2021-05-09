/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import { defineCustomElements as defineIonPhaser } from "@ion-phaser/core/loader";
import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/ion-\w*/];

defineIonPhaser(window);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "https://trojanhorse.cc",
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
