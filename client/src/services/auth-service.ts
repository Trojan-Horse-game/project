import axios from "axios";

const API_URL = "http://localhost:3000";

class AuthService {
  signin(user) {
    return axios

      .post(API_URL + "/api/users/signin", {
        username: user.username,
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
      username: user.username,
      password: user.password
    });
  }

  postInfos(user) {
    return axios.post(API_URL + "", {
      firstName: user.firstName,
      name: user.name,
      username: user.username,
      mail: user.mail
    });
  }

  addFriend(username) {
    //On cherche l'user id de l'username
  }
}

export default new AuthService();
