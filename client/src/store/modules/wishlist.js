import WishlistService from '../../services/wishlist.service';

export const wishlist = {
  namespaced: true,
  state: {
    wishlistItems: []
  },
  mutations: {
    SET_WISHLIST(state, products) {
      state.wishlistItems = products || [];
      localStorage.removeItem('wishlist');
    },
    CLEAR_WISHLIST(state) {
      state.wishlistItems = [];
      localStorage.removeItem('wishlist');
    }
  },
  actions: {
    async fetchWishlist({ commit, rootGetters }) {
      if (!rootGetters['auth/isLoggedIn']) {
        commit('CLEAR_WISHLIST');
        return [];
      }

      const response = await WishlistService.getWishlist();
      commit('SET_WISHLIST', response.data);
      return response.data;
    },
    async toggleWishlist({ commit, getters, rootGetters }, product) {
      if (!rootGetters['auth/isLoggedIn']) {
        const error = new Error('Please log in to use your wishlist');
        error.code = 'LOGIN_REQUIRED';
        throw error;
      }

      const productId = product._id || product.id;
      if (!productId) {
        throw new Error('Product id is required');
      }

      const wasInWishlist = getters.isInWishlist(productId);
      const response = wasInWishlist
        ? await WishlistService.removeFromWishlist(productId)
        : await WishlistService.addToWishlist(productId);

      commit('SET_WISHLIST', response.data);
      return { added: !wasInWishlist, items: response.data };
    },
    async clearWishlist({ commit, rootGetters }, options = {}) {
      options = options || {};
      if (options.remote && rootGetters['auth/isLoggedIn']) {
        await WishlistService.clearWishlist();
      }
      commit('CLEAR_WISHLIST');
    }
  },
  getters: {
    wishlistItems: (state) => state.wishlistItems,
    wishlistCount: (state) => state.wishlistItems.length,
    isInWishlist: (state) => (productId) => {
      return state.wishlistItems.some(item => (item._id || item.id) === productId);
    }
  }
};
