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
    }
  },
  {
    path: "/connexion",
    name: "Connexion",
    component: Login,
    meta: {
      title: "Les Cavaliers de Troie - Login"
    }
  },
  {
    path: "/parametres",
    name: "Paramètres",
    component: Parametres,
    meta: {
      title: "Les Cavaliers de Troie - Parametres"
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
    }
  },
  {
    path: "/choixEspece",
    name: "Choix espèce",
    component: choixEspece,
    meta: {
      title: "Les Cavaliers de Troie - Choix de l'espèce"
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(
    document.querySelectorAll("[data-vue-router-controlled]")
  ).forEach(el => el.remove());

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router;
