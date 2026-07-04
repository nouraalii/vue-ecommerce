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

const initialState = user && token
  ? { status: { loggedIn: true }, user: normalizeUser(user), token }
  : { status: { loggedIn: false }, user: null, token: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    async login({ commit, dispatch }, user) {
      try {
        const data = await AuthService.login(user);
        commit('loginSuccess', data);
        dispatch('wishlist/fetchWishlist', null, { root: true }).catch(() => {});
        await dispatch('cart/mergeCart', null, { root: true }).catch(() => {});
        return Promise.resolve(data);
      } catch (error) {
        commit('loginFailure');
        return Promise.reject(error);
      }
    },
    logout({ commit, dispatch }) {
      AuthService.logout();
      commit('logout');
      dispatch('cart/clearCart', null, { root: true });
      dispatch('wishlist/clearWishlist', null, { root: true });
    },
    async register({ commit, dispatch }, user) {
      try {
        const data = await AuthService.register(user);
        commit('registerSuccess', data);
        dispatch('wishlist/fetchWishlist', null, { root: true }).catch(() => {});
        await dispatch('cart/mergeCart', null, { root: true }).catch(() => {});
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
      localStorage.removeItem('wishlist');
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
      localStorage.removeItem('wishlist');
    },
    registerFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    SET_USER(state, user) {
      const normalized = normalizeUser(user);
      state.user = normalized;
      localStorage.setItem('user', JSON.stringify(normalized));
    }
  },
  getters: {
    isLoggedIn: state => state.status.loggedIn,
    user: state => state.user,
    token: state => state.token,
    role: state => state.user ? state.user.role : null,
  }
};
