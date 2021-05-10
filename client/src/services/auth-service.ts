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
          localStorage.setItem("username", user.username);
          localStorage.setItem("token", response.data.token);
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  }

  signup(user) {
    const url = `${API_URL}/users/signup`;
    return axios.post(url, {
      username: user.username,
      password: user.password
    });
  }
}

export default new AuthService();
