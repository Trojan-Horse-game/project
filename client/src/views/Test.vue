<template>
  <v-app>
    <div id="container">
      <div id="background">
        <img src="Design/Profil.gif" usemap="#image-map" />
        <map name="image-map">
          <router-link to="/menuPrincipal">
            <area
              target="_self"
              alt="Retour au menu principal"
              element="Retour au menu principal"
              coords="482,714,658,782"
              shape="rect"
            />
          </router-link>
          <router-link to="/menuPrincipal">
            <area
              target="_self"
              alt="Retour au menu principal"
              element="Retour au menu principal"
              coords="761,711,938,779"
              shape="rect"
            />
          </router-link>
        </map>
      </div>

      <!-- Nom lastname - prenom firstName - username - mail -->
      <div id="content">
        <v-form id="infos">
          <v-text-field
            color="black"
            :value="lastNameProp"
            filled
            :rules="[rules.required]"
            label="Nom"
          />
          <v-text-field
            color="black"
            :value="firstNameProp"
            filled
            :rules="[rules.required]"
            label="Prénom"
          />
          <v-text-field
            color="black"
            :value="usernameProp"
            filled
            :rules="[rules.required]"
            label="Username"
          />
          <v-text-field
            color="black"
            :value="mailProp"
            filled
            :rules="[rules.required, rules.mail]"
            label="Adresse mail"
          />
        </v-form>

        <table id="stats">
          <tr>
            <td class="element">
              <img
                class="etoile"
                src="Design/victoires.png"
                alt="Étoile noire"
              />Nombre de victoires
            </td>
            <td class="value bg-none">{{ nbVictoriesProp }}</td>
          </tr>
          <tr>
            <td class="element">
              <img
                class="etoile"
                src="Design/defaites.png"
                alt="Étoile noire"
              />Nombre de défaites
            </td>
            <td class="value bg-none">{{ nbDefeatsProp }}</td>
          </tr>
        </table>

        <div id="buttons-row">
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-large icon v-bind="attrs" v-on="on">
                <v-icon>mdi-account-group</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-tabs
                v-model="tab"
                background-color="#fff"
                color="#000"
                centered
                icons-and-text
              >
                <v-tabs-slider></v-tabs-slider>
                <v-tab href="#friends">
                  Liste de vos ami‧e‧s
                  <v-icon>mdi-account-group</v-icon>
                </v-tab>

                <v-tab
                  href="#friends-requests"
                  v-if="this.pendingFriendRequests.length > 0"
                >
                  Demandes d'amitié en attente
                  <v-badge
                    bordered
                    color="red"
                    :content="this.pendingFriendRequests.length"
                    offset-y="10"
                  >
                    <v-icon>mdi-account-heart</v-icon>
                  </v-badge>
                </v-tab>

                <v-tabs-items v-model="tab">
                  <v-tab-item value="friends">
                    <v-card flat>
                      <v-card-text>
                        <div class="friend-list">
                          <span
                            class="friend"
                            v-for="friend in friends"
                            :key="friend"
                          >
                            {{ friend }}
                            <v-btn
                              class="friend-action deleteFriend"
                              title="Supprimer ami"
                              icon
                              small
                              @click="deleteFriend(friend)"
                              ><v-icon>mdi-delete</v-icon></v-btn
                            >
                          </span>
                        </div>
                      </v-card-text>
                      <v-divider></v-divider>

                      <v-card-actions>
                        <div id="add-friend">
                          <v-form v-model="validInput">
                            <v-text-field
                              hide-details
                              hint="Nom d'utilisateur‧trice"
                              v-show="this.showFriendInput"
                              v-model="newFriend"
                              :rules="[rules.required]"
                            />
                            <v-btn
                              v-show="this.showFriendInput"
                              @click="addFriendFromInput()"
                              >Ajouter</v-btn
                            >
                          </v-form>
                        </div>

                        <v-btn
                          @click="showFriendForm()"
                          v-show="!this.showFriendInput"
                          ><v-icon>mdi-account-plus</v-icon></v-btn
                        >
                        <v-btn text @click="dialog = false">
                          Fermer
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item value="friends-requests"
                    ><v-card flat>
                      <v-card-text>
                        <div class="friend-list">
                          <span
                            class="friend"
                            v-for="friend in pendingFriendRequests"
                            :key="friend"
                          >
                            {{ friend }}
                            <v-btn
                              class="friend-action"
                              title="Accepter la demande"
                              icon
                              small
                              @click="acceptFriendRequest(friend)"
                              color="green"
                              ><v-icon>mdi-check</v-icon></v-btn
                            >
                            <v-btn
                              class="friend-action"
                              title="Refuser la demande"
                              icon
                              small
                              color="red"
                              @click="declineFriendRequest(friend)"
                              ><v-icon>mdi-close</v-icon></v-btn
                            >
                          </span>
                        </div>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-btn text @click="dialog = false">
                          Fermer
                        </v-btn>
                      </v-card-actions>
                    </v-card></v-tab-item
                  >
                </v-tabs-items>
              </v-tabs>
            </v-card>
          </v-dialog>

          <v-btn
            @click="logout()"
            id="logout"
            title="Se déconnecter"
            x-large
            icon
            ><v-icon>mdi-logout</v-icon></v-btn
          >
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    tab: null,
    newFriend: "",
    showFriendInput: false,
    validInput: false,
    rules: {
      required: value => !!value || "Champ requis",
      mail: value => {
        const mailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (value && mailPattern.test(value)) || "Adresse mail invalide";
      }
    }
  }),

  props: {
    lastNameProp: {
      type: String,
      default: "Dorian"
    },

    firstNameProp: {
      type: String,
      default: "Arno"
    },
    usernameProp: {
      type: String,
      default: "frenchAssassin"
    },
    mailProp: {
      type: String,
      default: "frenchAssassin@outlook.com"
    },
    nbVictoriesProp: {
      type: Number,
      default: 10
    },
    nbDefeatsProp: {
      type: Number,
      default: 2
    },
    friends: {
      type: Array,
      default: () => ["Elise de la Serre", "Pierre Bellec"]
    },

    pendingFriendRequests: {
      type: Array,
      default: () => ["Ezio Auditore", "Marquis de Sade"]
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },

    showFriendForm() {
      this.showFriendInput = true;
    },

    addFriendFromInput() {
      this.friends.push(this.newFriend);
      this.showFriendInput = false;
      this.newFriend = "";
    },

    addFriend(friend) {
      this.friends.push(friend);
    },

    deleteFriend(friendToDelete) {
      this.friends = this.friends.filter(friend => friend != friendToDelete);
    },

    acceptFriendRequest(friendRequest) {
      this.addFriend(friendRequest);
      this.pendingFriendRequests = this.pendingFriendRequests.filter(
        friend => friend != friendRequest
      );
    },

    declineFriendRequest(friendRequest) {
      this.pendingFriendRequests = this.pendingFriendRequests.filter(
        friend => friend != friendRequest
      );
    }
  }
};
</script>

<style lang="scss" scoped>
$gris: #b9bab9;

#background img {
  width: 100%;
  height: 100%;
  z-index: -1;
}

#content {
  width: 540px;
  height: 497px;
  top: 156px;
  left: 459px;
  z-index: 0;
  color: #171717;
  padding: 5px 10px;
  position: absolute;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: center;
}

#container {
  position: relative;
}

#infos {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 10px 0px 0px 0px;
  width: 90%;
}

.theme--light.v-label {
  color: rgba(0, 0, 0, 0.6) !important;
}

#stats td {
  width: max-content;
}

#stats .element {
  display: flex;
  align-items: center;
  height: 100%;
}

#stats .value {
  min-width: 50px;
  text-align: center;
}

#stats img {
  margin: 0px 10px 0px 0px;
}

#buttons-row {
  display: flex;
  justify-content: center;
}

#buttons-row .v-btn {
  background-color: transparent !important;
  color: #000 !important;
}

li {
  list-style: none;
}

ul {
  margin: 20px 0px;
}

.v-card {
  background-color: #fff;
  color: #000;
}

.friend-list {
  display: flex;
  flex-direction: column;
}
#add-friend {
  display: flex;
  flex-direction: row;
}

.v-btn.deleteFriend {
  color: #000 !important;
}

.v-card__actions {
  display: flex;
  justify-content: flex-end;
}

.v-card__actions .v-btn {
  background-color: $gris !important;
  color: #000 !important;
  border: 1px solid #000;
}

.v-input {
  padding: 0px 10px 0px 0px;
  margin: 0px;
  height: 100%;
}

.v-btn.friend-action {
  background-color: transparent !important;
  margin: 0px 0px 0px 10px;
  visibility: hidden;
  height: 25px;
  width: 25px;
}

.friend {
  display: table-cell;
  vertical-align: middle;
  user-select: none;
}

.friend:hover .v-btn.friend-action {
  visibility: visible;
}

.v-form {
  display: flex;
}
</style>
