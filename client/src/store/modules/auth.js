import AuthService from '../../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const normalizeUser = userData => {
  if (!userData) return null;

  return {
    ...userData,
    id: userData.id || userData._id,
    role: userData.role || 'customer'
  };
};

const initialState = user
  ? { status: { loggedIn: true }, user: normalizeUser(user), token }
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
      const user = normalizeUser(data.user);
      state.status.loggedIn = true;
      state.user = user;
      state.token = data.token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    registerSuccess(state, data) {
      const user = normalizeUser(data.user);
      state.status.loggedIn = true;
      state.user = user;
      state.token = data.token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  getters: {
    isLoggedIn: state => state.status.loggedIn,
    user: state => state.user,
    token: state => state.token,
    role: state => state.user ? state.user.role : null,
  }
};
