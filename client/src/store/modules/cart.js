const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

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
    items: savedCart,
    isDrawerOpen: false,
    shippingPrice: 10.00,
    taxRate: 0.08,
    appliedPromo: null
  },
  actions: {
    addToCart({ commit, state }, payload) {
      const { product, quantity = 1, variant = null } = payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === product._id && item.variant === variant
      );

      if (existingItemIndex !== -1) {
        commit('updateQuantity', { index: existingItemIndex, quantity: state.items[existingItemIndex].quantity + quantity });
      } else {
        commit('addItem', { product, quantity, variant });
      }
      commit('openDrawer');
    },
    removeFromCart({ commit }, index) {
      commit('removeItem', index);
    },
    updateItemQuantity({ commit }, { index, quantity }) {
      if (quantity > 0) {
        commit('updateQuantity', { index, quantity });
      } else {
        commit('removeItem', index);
      }
    },
    clearCart({ commit }) {
      commit('clearItems');
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
    addItem(state, item) {
      state.items.push(item);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity(state, { index, quantity }) {
      state.items[index].quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItem(state, index) {
      state.items.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearItems(state) {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify(state.items));
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
    cartSubtotal: state => state.items.reduce((total, item) => total + (item.product.basePrice * item.quantity), 0),
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
