import api from './api';

class ReviewService {
  async getReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  }

  async createReview(productId, data) {
    const response = await api.post(`/products/${productId}/reviews`, data);
    return response.data;
  }

  async updateReview(productId, reviewId, data) {
    const response = await api.put(`/products/${productId}/reviews/${reviewId}`, data);
    return response.data;
  }

  async deleteReview(productId, reviewId) {
    const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
    return response.data;
  }
}

export default new ReviewService();
