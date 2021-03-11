import axios from "axios";

const API_URL = "http://localhost:3000/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "users/signin", {
        email: user.username,
        password: user.password
      })
      .then((response) => {
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
    return axios.post(API_URL + "users/signup", {
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
