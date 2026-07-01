import api from './api';

class SellerService {
  async getMetrics() {
    const response = await api.get('/seller/metrics');
    return response.data;
  }

  async getProducts() {
    const response = await api.get('/seller/products');
    return response.data;
  }

  async createProduct(formData) {
    const response = await api.post('/seller/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await api.put('/seller/profile', profileData);
    return response.data;
  }
}

export default new SellerService();
