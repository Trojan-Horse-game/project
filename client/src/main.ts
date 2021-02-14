/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");

/*const { app, BrowserWindow } = require("electron");

const url = require("url");
const path = require("path");

let mainWindow: typeof BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    icon: __dirname + "/appIcon.ico",
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (mainWindow != null) {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, `./dist/index.html`),
        protocol: "file:",
        slashes: true
      })
    );
    mainWindow.on("closed", function() {
      mainWindow = null;
    });
  }
  console.log(app);
  app.on("ready", createWindow);

  app.on("window-all-closed", function() {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", function() {
    if (mainWindow === null) createWindow();
  }); 
}
*/