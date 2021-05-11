import axios from "axios";

const API_URL = "https://localhost:3000/api/friendships";
const myUserId: string = localStorage.getItem("userId");

class userService {
  getUserId(username: string) {
    let userId = "";
    axios.get(API_URL, { params: { user: username } }).then(response => {
      userId = response.data.userId;
    });

    return userId;
  }

  getFriendships() {
    return axios.get(API_URL, { params: { id: myUserId } });
  }

  addFriendship(friendUsername: string) {
    const friendUserId: string = this.getUserId(friendUsername);

    axios.post("https://localhost:3000/api/friendships", {
      user1_id: myUserId,
      user2_id: friendUserId
    });
  }
  /*login(user) {
    return axios
      .post(API_URL + "/api/users/signin", {
        email: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("token", response.data.token);
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  }

  signup(user) {
    return axios.post(API_URL + "/api/users/signup", {
      email: user.email,
      password: user.password
    });
  }*/
}

export default new userService();
