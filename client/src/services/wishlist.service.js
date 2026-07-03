import api from './api';

const WISHLIST_ENDPOINT = '/wishlist';

class WishlistService {
  async getWishlist() {
    const response = await api.get(WISHLIST_ENDPOINT);
    return response.data;
  }

  async addToWishlist(productId) {
    const response = await api.post(`${WISHLIST_ENDPOINT}/${productId}`);
    return response.data;
  }

  async removeFromWishlist(productId) {
    const response = await api.delete(`${WISHLIST_ENDPOINT}/${productId}`);
    return response.data;
  }

  async clearWishlist() {
    const response = await api.delete(WISHLIST_ENDPOINT);
    return response.data;
  }
}

export default new WishlistService();
