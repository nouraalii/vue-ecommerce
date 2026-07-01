export const wishlist = {
  namespaced: true,
  state: {
    wishlistItems: JSON.parse(localStorage.getItem('wishlist')) || []
  },
  mutations: {
    TOGGLE_WISHLIST(state, product) {
      const index = state.wishlistItems.findIndex(item => item._id === product._id);
      if (index !== -1) {
        state.wishlistItems.splice(index, 1);
      } else {
        state.wishlistItems.push(product);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
    },
    CLEAR_WISHLIST(state) {
      state.wishlistItems = [];
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
    }
  },
  actions: {
    toggleWishlist({ commit }, product) {
      commit('TOGGLE_WISHLIST', product);
    },
    clearWishlist({ commit }) {
      commit('CLEAR_WISHLIST');
    }
  },
  getters: {
    wishlistItems: (state) => state.wishlistItems,
    wishlistCount: (state) => state.wishlistItems.length,
    isInWishlist: (state) => (productId) => {
      return state.wishlistItems.some(item => item._id === productId);
    }
  }
};
