import axios from "axios";

const API_URL = "http://api.trojanhorse.cc";

class AuthService {
  signin(user) {
    const url = `${API_URL}/users/signin`;
    return axios
      .post(url, {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
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
    const url = `${API_URL}/users/signup`;
    return axios.post(url, {
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
}

export default new AuthService();
