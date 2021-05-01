import AuthService from "../../services/auth-service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
    signup({ commit }, user) {
      return AuthService.signup(user).then(
        response => {
          commit("signupSuccess");
          return Promise.resolve(response.data);
        },
        error => {
          commit("signupFailure");
          return Promise.reject(error);
        }
      );
    },
    signin({ commit }, user) {
      return AuthService.signin(user).then(
        response => {
          commit("signinSuccess");
          return Promise.resolve(response.data);
        },
        error => {
          commit("signupFailure");
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    signupSuccess(state) {
      state.status.loggedIn = false;
    },
    signupFailure(state) {
      state.status.loggedIn = false;
    }
  }
};
