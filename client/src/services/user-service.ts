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
}

export default new userService();
