import api from './api';

class ProductService {
  async getProducts(params = {}) {
    // Convert params object to query string
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    }
    const queryString = queryParams.toString();
    const response = await api.get(`/products${queryString ? '?' + queryString : ''}`);
    return response.data;
  }

  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }
}

export default new ProductService();
