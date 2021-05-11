/* eslint-disable */
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LandingPage from "../views/LandingPage.vue";
import NouveauCompte from "../views/nouveauCompte.vue";
import MenuPrincipal from "../views/MenuPrincipal.vue";
import Login from "../views/Login.vue";
import Parametres from "../views/Parametres.vue";
import Regles from "../views/Regles.vue";
import Profil from "../views/Profil.vue";
import Game from "../views/Game.vue";
import rejoindrePartie from "../views/RejoindrePartie.vue";
import choixEspece from "../views/choixEspece.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Landing Page",
    component: LandingPage,
    meta: {
      title: "Les Cavaliers de Troie - Bienvenue"
    }
  },
  {
    path: "/inscription",
    name: "Inscription",
    component: NouveauCompte,
    meta: {
      title: "Les Cavaliers de Troie - Inscription"
    }
  },
  {
    path: "/menuPrincipal",
    name: "Menu principal",
    component: MenuPrincipal,
    meta: {
      title: "Les Cavaliers de Troie - Menu principal"
    },
    props: true
  },
  {
    path: "/connexion",
    name: "Connexion",
    component: Login,
    meta: {
      title: "Les Cavaliers de Troie - Connexion"
    }
  },
  {
    path: "/parametres",
    name: "Paramètres",
    component: Parametres,
    meta: {
      title: "Les Cavaliers de Troie - Paramètres"
    }
  },
  {
    path: "/reglesDuJeu",
    name: "Règles du jeu",
    component: Regles,
    meta: {
      title: "Les Cavaliers de Troie - Règles du jeu"
    }
  },
  {
    path: "/profil",
    name: "Profil",
    component: Profil,
    meta: {
      title: "Les Cavaliers de Troie - Profil"
    }
  },
  {
    path: "/Jeu",
    name: "Jeu",
    component: Game,
    meta: {
      title: "Les Cavaliers de Troie - Jeu"
    }
  },
  {
    path: "/rejoindrePartie",
    name: "Rejoindre partie",
    component: rejoindrePartie,
    meta: {
      title: "Les Cavaliers de Troie - Rejoindre une partie"
    },
    props: true
  },
  {
    path: "/choixEspece",
    name: "Choix espèce",
    component: choixEspece,
    meta: {
      title: "Les Cavaliers de Troie - Choix de l'espèce"
    },
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
