<template>
  <v-app>
    <div id="background-image" />
    <Logo />
    <div id="container">
      <span id="titre">Mon profil</span>

      <div id="content">
        <table id="infos">
          <tr>
            <td>Nom</td>
            <td>
              <input color="#000" v-model="lastNameProp" />
            </td>
          </tr>

          <tr>
            <td>Prénom</td>
            <td>
              <input color="#000" v-model="firstNameProp" />
            </td>
          </tr>

          <tr>
            <td>Username</td>
            <td>
              <input color="#000" v-model="username" />
            </td>
          </tr>

          <tr>
            <td>Adresse mail</td>
            <td>
              <input color="#000" v-model="mail" />
            </td>
          </tr>
        </table>

        <table id="stats">
          <tr>
            <td class="element">
              <img
                class="etoile"
                src="Design/victoires.png"
                alt="Étoile noire"
              />Nombre de victoires
            </td>
            <td class="value bg-none">{{ nbVictoires }}</td>
          </tr>
          <tr>
            <td class="element">
              <img
                class="etoile"
                src="Design/defaites.png"
                alt="Étoile noire"
              />Nombre de défaites
            </td>
            <td class="value bg-none">{{ nbDefaites }}</td>
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
                color="#2f363c"
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
                  v-if="this.friendRequests.length > 0"
                >
                  Demandes d'amitié en attente
                  <v-badge
                    bordered
                    color="red"
                    :content="this.friendRequests.length"
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
                          <v-form>
                            <v-text-field
                              hide-details
                              hint="Nom d'utilisateur‧trice"
                              v-show="this.showFriendInput"
                              v-model="newFriend"
                              color="#2f363c"
                            />
                            <v-btn
                              v-show="this.showFriendInput"
                              @click="addFriendFromInput()"
                              :class="{ desactive: this.newFriend.length == 0 }"
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
                            v-for="friend in friendRequests"
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
      <div id="buttons">
        <router-link to="/menuPrincipal">
          <button id="retour" />
        </router-link>
        <v-btn id="valider" @click="submitForm()" />
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Logo from "../components/Logo.vue";
import axios from "axios";

export default {
  components: { Logo: Logo },
  data: () => ({
    apiUrl: "http://api.trojanhorse.cc",
    dialog: false,
    tab: null,
    newFriend: "",
    showFriendInput: false,
    mailPattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    errors: [],
    friends: [],
    friendRequests: [],
    username: "",
    mail: "",
    nbVictoires: 0,
    nbDefaites: 0
  }),

  mounted: async function() {
    await this.getUserInfos();
  },

  methods: {
    submitForm() {
      const errors = [];

      if (this.username.length < 1) {
        errors.push("Username requis");
      }

      if (this.mail.length < 1) {
        errors.push("Mail requis");
      } else if (!this.mailPattern.test(this.mailProp)) {
        errors.push("Adresse mail invalide");
      }

      let alertMessage: string;

      if (errors.length != 0) {
        alertMessage = errors.length > 1 ? "Erreurs\n" : "Erreur:\n";
        for (const error of errors) {
          alertMessage += `\t${error}\n`;
        }
      } else {
        alertMessage = "Modifications enregistrées !";
      }

      alert(alertMessage);
    },

    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },

    showFriendForm() {
      this.showFriendInput = true;
    },

    async getUserInfos() {
      const myUserId = this.getMyUserId();
      const url = `${this.apiUrl}/users/${myUserId}`;

      try {
        const response = await axios.get(url);
        const userInfos = response.data;

        this.username = userInfos.username;
        this.mail = userInfos.mail;
        this.nbVictoires = userInfos.wins;
        this.nbDefaites = userInfos.games - userInfos.wins;
      } catch (errors) {
        console.error(errors);
      }
    },

    getMyUserId(): number {
      const userId = localStorage.getItem("userId");
      return Number.parseInt(userId, 10);
    },

    async getUserId(username: string) {
      const url = `${this.apiUrl}/users`;
      try {
        const response = await axios.get(url);

        for (const user of response.data) {
          if (user.username === username) {
            return user.id;
          }
        }
      } catch (errors) {
        console.error(errors);
      }

      return -1;
    },

    async getUsername(userId: number) {
      let username: string = null;
      const url = `${this.apiUrl}/users/${userId}`;

      try {
        const response = await axios.get(url);

        if (response.data) {
          username = response.data.username;
        } else {
          throw new Error("User id not found");
        }
      } catch (errors) {
        console.log(errors);
      }

      return username;
    },

    async addFriend(friendUsename: string) {
      /* eslint-disable @typescript-eslint/camelcase */

      const friendUserId = await this.getUserId(friendUsename);

      if (friendUserId === -1) {
        console.error(`Error while looking for ${friendUsename}'s userId`);
        return;
      }

      axios.post(this.apiUrl + "/friendships/add", {
        user1_id: this.getMyUserId(),
        user2_id: friendUserId
      });
    },

    async answerFriendRequest(friendUsename: string, accepted: boolean) {
      const friendUserId = await this.getUserId(friendUsename);

      if (friendUserId === -1) {
        console.error(`Error while looking for ${friendUsename}'s userId`);
        return;
      }

      const myUserId = this.getMyUserId();
      const url = `${this.apiUrl}/friendships/respond/${myUserId}/${friendUserId}`;
      const answer = accepted ? "confirmed" : "rejected";
      try {
        axios.put(
          url,
          {
            status: answer
          },
          {
            params: {
              id1: myUserId,
              id2: friendUserId
            }
          }
        );
      } catch (errors) {
        console.error(errors);
      }

      await this.getFriends();
    },

    async getFriends() {
      const myUserId = this.getMyUserId();
      this.friends = [];
      this.friendRequests = [];

      try {
        const url = `${this.apiUrl}/friendships/${myUserId}`;
        const response = await axios.get(url);

        for (const friendship of response.data) {
          const friendUserId: number =
            friendship.user1_id === myUserId
              ? friendship.user2_id
              : friendship.user1_id;

          const friendUsename = await this.getUsername(friendUserId);

          if (friendship.status === "confirmed") {
            this.friends.push(friendUsename);
          } else if (friendship.status === "pending") {
            this.friendRequests.push(friendUsename);
          }
        }
      } catch (errors) {
        console.error(errors);
      }
    },

    async deleteFriend(friendUsername: string) {
      const myUserId = this.getMyUserId();
      const friendUserId: number = await this.getUserId(friendUsername);
      const url = `${this.apiUrl}/friendships/${myUserId}/${friendUserId}`;
      await axios.delete(url, {
        params: {
          id1: myUserId,
          id2: friendUserId
        }
      });
      await this.getFriends();
    },

    addFriendFromInput() {
      this.addFriend(this.newFriend);
      this.showFriendInput = false;
      this.newFriend = "";
    },

    acceptFriendRequest(friendUsername: string) {
      this.answerFriendRequest(friendUsername, true);
    },

    declineFriendRequest(friendUsername: string) {
      this.answerFriendRequest(friendUsername, false);
    }
  },

  watch: {
    dialog: function() {
      this.getFriends();
    }
  }
};
</script>

<style lang="scss" scoped>
$textColor: #bbbbbb;
$content: #2f363c;

#background-image {
  background-image: url("../../public/Design/default-bck.gif");
}

#logo {
  position: absolute;
  top: 1%;
  left: 1%;
}

#logo img {
  width: 250px;
  height: auto;
}

#container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#content {
  width: max-content;
  height: max-content;
  padding: 5%;
  z-index: 0;
  color: $textColor;
  padding: 5px 10px;
  background-color: $content;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: center;
  font-size: 25px;
  flex-grow: 1;
  justify-content: space-around;
  margin: 2% 0%;
}

#titre {
  font-size: 70px;
  color: $textColor;
  margin: 0 auto;
  margin-top: 1%;
}

#content input {
  background-image: url("input.png");
  background-repeat: no-repeat;
  padding-left: 20px;
  font-size: 20px;
  background-size: contain;
  padding: 10px 0px 35px 0px;
}

input:focus {
  outline: none;
}

table {
  width: 100%;
}

tr td:nth-child(1) {
  vertical-align: top;
  padding-top: 9px;
  width: max-content;
}

td {
  text-align: center;
  vertical-align: middle;
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
  color: $textColor;
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
  color: #bbbbbb !important;
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
  color: #2f363c !important;
}

.v-card__actions {
  display: flex;
  justify-content: flex-end;
}

.v-card__actions .v-btn {
  background-color: #b8b7b8 !important;
  color: #000 !important;
  border: 1px solid #2f363c;
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

#buttons {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  height: 20%;
}
#buttons button {
  height: 69px;
  width: 178px;
}
#retour {
  background-image: url("../../public/Design/retour.png");
}

#valider {
  background-image: url("../../public/Design/valider.png");
}

.desactive {
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
