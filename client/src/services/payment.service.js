import api from './api';

class PaymentService {
  async createCheckoutSession(orderData) {
    const response = await api.post('/payments/create-checkout-session', orderData);
    return response.data;
  }
}

export default new PaymentService();
