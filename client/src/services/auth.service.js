import api from './api';

class AuthService {
  async login(user) {
    const response = await api.post('/auth/login', {
      email: user.email,
      password: user.password,
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async register(user) {
    const response = await api.post('/auth/register', user);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  }

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  }
}

export default new AuthService();
