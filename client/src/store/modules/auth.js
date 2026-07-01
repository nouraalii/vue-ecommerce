import AuthService from '../../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = user
  ? { status: { loggedIn: true }, user, token }
  : { status: { loggedIn: false }, user: null, token: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    async login({ commit }, user) {
      try {
        const data = await AuthService.login(user);
        commit('loginSuccess', data);
        return Promise.resolve(data);
      } catch (error) {
        commit('loginFailure');
        return Promise.reject(error);
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    async register({ commit }, user) {
      try {
        const data = await AuthService.register(user);
        commit('registerSuccess', data);
        return Promise.resolve(data);
      } catch (error) {
        commit('registerFailure');
        return Promise.reject(error);
      }
    }
  },
  mutations: {
    loginSuccess(state, data) {
      state.status.loggedIn = true;
      state.user = data.user;
      state.token = data.token;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
    },
    registerSuccess(state, data) {
      state.status.loggedIn = true;
      state.user = data.user;
      state.token = data.token;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  },
  getters: {
    isLoggedIn: state => state.status.loggedIn,
    user: state => state.user,
    token: state => state.token,
    role: state => state.user ? state.user.role : null,
  }
};
