import api from './api';

class OrderService {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  }

  async getMyOrders() {
    const response = await api.get('/orders/myorders');
    return response.data;
  }

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }

  async validatePromo(code) {
    const response = await api.post('/orders/validate-promo', { code });
    return response.data;
  }
}

export default new OrderService();
