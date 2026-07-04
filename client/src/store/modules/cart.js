import CartService from '../../services/cart.service';

const getGuestCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const setGuestCart = (items) => localStorage.setItem('cart', JSON.stringify(items));

const normalizePromo = promo => {
  if (!promo) return null;

  return {
    code: String(promo.code || '').trim().toUpperCase(),
    discountType: promo.discountType || 'percentage',
    discountValue: Number(promo.discountValue) || 0,
    discountAmount: Number(promo.discountAmount) || 0
  };
};

export const cart = {
  namespaced: true,
  state: {
    items: getGuestCart(), // Starts with guest cart or empty
    isDrawerOpen: false,
    shippingPrice: 10.00,
    taxRate: 0.08,
    appliedPromo: null,
    loading: false
  },
  actions: {
    async fetchCart({ commit, rootGetters }) {
      if (rootGetters['auth/isLoggedIn']) {
        commit('setLoading', true);
        try {
          const res = await CartService.getCart();
          commit('setItems', res.data.items);
        } catch (error) {
          console.error('Fetch cart error', error);
        } finally {
          commit('setLoading', false);
        }
      }
    },
    async addToCart({ commit, state, rootGetters }, payload) {
      const { product, quantity = 1 } = payload;
      const isLoggedIn = rootGetters['auth/isLoggedIn'];

      if (isLoggedIn) {
        try {
          const res = await CartService.addToCart(product._id || product.id, quantity);
          commit('setItems', res.data.items);
        } catch (error) {
          console.error(error);
        }
      } else {
        const existingItemIndex = state.items.findIndex(item => item.product._id === (product._id || product.id));
        if (existingItemIndex !== -1) {
          commit('updateGuestQuantity', { index: existingItemIndex, quantity: state.items[existingItemIndex].quantity + quantity });
        } else {
          commit('addGuestItem', { product, quantity });
        }
      }
      commit('openDrawer');
    },
    async removeFromCart({ commit, state, rootGetters }, payload) {
      const { index, productId } = payload;
      if (rootGetters['auth/isLoggedIn']) {
        try {
          const res = await CartService.removeFromCart(productId);
          commit('setItems', res.data.items);
        } catch (error) {
          console.error(error);
        }
      } else {
        commit('removeGuestItem', index);
      }
    },
    async updateItemQuantity({ commit, state, rootGetters }, { index, productId, quantity }) {
      if (rootGetters['auth/isLoggedIn']) {
        try {
          if (quantity > 0) {
            const res = await CartService.updateCartItem(productId, quantity);
            commit('setItems', res.data.items);
          } else {
            const res = await CartService.removeFromCart(productId);
            commit('setItems', res.data.items);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        if (quantity > 0) {
          commit('updateGuestQuantity', { index, quantity });
        } else {
          commit('removeGuestItem', index);
        }
      }
    },
    async clearCart({ commit, rootGetters }) {
      if (rootGetters['auth/isLoggedIn']) {
        try {
          await CartService.clearCart();
          commit('setItems', []);
        } catch (error) {
          console.error(error);
        }
      } else {
        commit('clearGuestItems');
      }
    },
    async mergeCart({ commit, state, rootGetters }) {
      if (rootGetters['auth/isLoggedIn']) {
        const guestItems = getGuestCart().map(item => ({
          productId: item.product._id || item.product.id,
          quantity: item.quantity
        }));
        
        if (guestItems.length > 0) {
          try {
            const res = await CartService.mergeCart(guestItems);
            commit('setItems', res.data.items);
            commit('clearGuestItems');
          } catch (error) {
            console.error(error);
          }
        } else {
          // just fetch
          try {
            const res = await CartService.getCart();
            commit('setItems', res.data.items);
          } catch(e) {}
        }
      }
    },
    toggleDrawer({ commit }) {
      commit('toggleDrawer');
    },
    closeDrawer({ commit }) {
      commit('closeDrawer');
    },
    applyPromo({ commit }, promo) {
      commit('setAppliedPromo', promo);
    },
    removePromo({ commit }) {
      commit('clearAppliedPromo');
    }
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status;
    },
    setItems(state, items) {
      state.items = items;
    },
    addGuestItem(state, item) {
      state.items.push(item);
      setGuestCart(state.items);
    },
    updateGuestQuantity(state, { index, quantity }) {
      state.items[index].quantity = quantity;
      setGuestCart(state.items);
    },
    removeGuestItem(state, index) {
      state.items.splice(index, 1);
      setGuestCart(state.items);
    },
    clearGuestItems(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },
    toggleDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openDrawer(state) {
      state.isDrawerOpen = true;
    },
    closeDrawer(state) {
      state.isDrawerOpen = false;
    },
    setAppliedPromo(state, promo) {
      state.appliedPromo = normalizePromo(promo);
    },
    clearAppliedPromo(state) {
      state.appliedPromo = null;
    }
  },
  getters: {
    cartItems: state => state.items,
    itemCount: state => state.items.reduce((total, item) => total + item.quantity, 0),
    cartSubtotal: state => state.items.reduce((total, item) => total + ((item.product?.basePrice || item.price || 0) * item.quantity), 0),
    cartTax: (state, getters) => getters.cartSubtotal * state.taxRate,
    cartDiscount: (state, getters) => {
      if (!state.appliedPromo) return 0;
      if (state.appliedPromo.discountType === 'fixed_amount') {
        return Math.min(state.appliedPromo.discountValue, getters.cartSubtotal);
      }
      return Math.min(getters.cartSubtotal * (state.appliedPromo.discountValue / 100), getters.cartSubtotal);
    },
    cartTotal: (state, getters) => Math.max(0, getters.cartSubtotal - getters.cartDiscount) + getters.cartTax + (getters.cartSubtotal > 0 ? state.shippingPrice : 0),
    shippingPrice: state => state.shippingPrice,
    isDrawerOpen: state => state.isDrawerOpen,
    appliedPromo: state => state.appliedPromo
  }
};
