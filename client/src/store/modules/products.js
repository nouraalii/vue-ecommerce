import ProductService from '../../services/product.service';

export const products = {
  namespaced: true,
  state: {
    items: [],
    pagination: {},
    total: 0,
    categories: [],
    loading: false,
    error: null,
    filters: {
      keyword: '',
      category: '',
      sort: '-createdAt',
      page: 1,
      limit: 12
    }
  },
  actions: {
    async fetchProducts({ commit, state }, params = {}) {
      commit('setLoading', true);
      try {
        const queryParams = { ...state.filters, ...params };
        const response = await ProductService.getProducts(queryParams);
        commit('setProducts', response);
        // Update filters if they changed
        commit('setFilters', params);
      } catch (error) {
        commit('setError', error.message);
      } finally {
        commit('setLoading', false);
      }
    },
    async fetchCategories({ commit }) {
      try {
        const response = await ProductService.getCategories();
        commit('setCategories', response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    },
    updateFilters({ commit, dispatch }, filters) {
      commit('setFilters', filters);
      dispatch('fetchProducts');
    }
  },
  mutations: {
    setProducts(state, payload) {
      state.items = payload.data;
      state.pagination = payload.pagination;
      state.total = payload.total;
      state.error = null;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    },
    setFilters(state, filters) {
      state.filters = { ...state.filters, ...filters };
    }
  },
  getters: {
    allProducts: state => state.items,
    allCategories: state => state.categories,
    isLoading: state => state.loading,
    currentFilters: state => state.filters,
    paginationParams: state => state.pagination,
    totalCount: state => state.total
  }
};
