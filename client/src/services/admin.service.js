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
}

export default new AdminService();
