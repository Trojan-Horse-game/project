<template>
  <div id="container">
    <logo title="Mon profil" />
    <ul>
      <li>Nom: {{ lastName }}</li>
      <li>Prénom: {{ firstName }}</li>
      <li>Username: {{ username }}</li>
      <li>Adresse mail: {{ mail }}</li>
      <li>Nombre de victoires: {{ nbVictories }}</li>
      <li>Nombre de défaites: {{ nbDefeats }}</li>
    </ul>

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
            background-color="#09203f accent-4"
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
                    <v-btn text @click="addFriendDialog = false">
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
                    <v-btn text @click="addFriendDialog = false">
                      Fermer
                    </v-btn>
                  </v-card-actions>
                </v-card></v-tab-item
              >
            </v-tabs-items>
          </v-tabs>
        </v-card>
      </v-dialog>

      <v-btn @click="logout()" id="logout" title="Se déconnecter" x-large icon
        ><v-icon>mdi-logout</v-icon></v-btn
      >
    </div>
    <router-link to="/menuPrincipal">
      <v-btn title="Retour au menu principal">Retour au menu principal</v-btn>
    </router-link>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";
export default {
  components: { logo: Logo },
  data: () => ({
    dialog: false,
    tab: null,
    addFriendDialog: false,
    newFriend: "",
    showFriendInput: false,
    validInput: false,
    rules: {
      required: value => !!value || "Champ requis"
    }
  }),

  props: {
    lastName: {
      type: String,
      default: "Dorian"
    },

    firstName: {
      type: String,
      default: "Arno"
    },
    username: {
      type: String,
      default: "frenchAssassin"
    },
    mail: {
      type: String,
      default: "frenchAssassin@outlook.com"
    },
    nbVictories: {
      type: Number,
      default: 10
    },
    nbDefeats: {
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

<style lang="css" scoped>
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

li {
  list-style: none;
}

ul {
  margin: 20px 0px;
}

#buttons-row .v-btn {
  background-color: transparent !important;
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
  color: #09203f !important;
}

.v-card__actions {
  display: flex;
  justify-content: flex-end;
}

.v-input {
  padding: 0px 10px 0px 0px;
  margin: 0px;
  height: 100%;
}

table {
  width: 90%;
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
