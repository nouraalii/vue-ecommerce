import api from './api';

class SellerService {
  async getSellerProducts(userId) {
    const response = await api.get(`/products?seller=${userId}&status=all&limit=100`);
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

  async getSellerOrders() {
    const response = await api.get('/orders/seller');
    return response.data;
  }

  async updateOrderItemStatus(orderId, itemId, status) {
    const response = await api.put(`/orders/${orderId}/item-status`, { itemId, status });
    return response.data;
  }

  async getSellerStats() {
    const response = await api.get('/auth/me/seller-stats');
    return response.data;
  }

  async requestPayout() {
    const response = await api.post('/auth/me/request-payout');
    return response.data;
  }

  async upgradeToSeller(storeName, storeDescription) {
    const response = await api.post('/auth/upgrade-seller', { storeName, storeDescription });
    return response.data;
  }

  async verifyEmail(email, code) {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  }

  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  }

  async googleLogin(payload) {
    const response = await api.post('/auth/google-login', payload);
    return response.data;
  }
}

export default new SellerService();
