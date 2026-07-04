import api from './api';

class AdminService {
  async getMetrics() {
    const response = await api.get('/users/metrics');
    return response.data;
  }

  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key]) queryParams.append(key, params[key]);
    }
    const queryString = queryParams.toString();
    const response = await api.get(`/users${queryString ? '?' + queryString : ''}`);
    return response.data;
  }

  async updateUserStatus(id, status) {
    const response = await api.put(`/users/${id}/status`, { status });
    return response.data;
  }

  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key]) queryParams.append(key, params[key]);
    }
    const queryString = queryParams.toString();
    const response = await api.get(`/products${queryString ? '?' + queryString : ''}`);
    return response.data;
  }

  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  }

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  }

  async archiveProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  async getCategories(params = {}) {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key]) queryParams.append(key, params[key]);
    }
    const queryString = queryParams.toString();
    const response = await api.get(`/categories${queryString ? '?' + queryString : ''}`);
    return response.data;
  }

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  }

  async archiveCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }

  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  }

  async updateOrderStatus(id, statusData) {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
  }

  async getPromos() {
    const response = await api.get('/promos');
    return response.data;
  }

  async createPromo(promoData) {
    const response = await api.post('/promos', promoData);
    return response.data;
  }

  async updatePromo(id, promoData) {
    const response = await api.put(`/promos/${id}`, promoData);
    return response.data;
  }

  async deletePromo(id) {
    const response = await api.delete(`/promos/${id}`);
    return response.data;
  }
}

export default new AdminService();
