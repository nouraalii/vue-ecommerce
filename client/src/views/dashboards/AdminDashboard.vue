<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Admin Dashboard</h1>
      <p class="mt-4 text-lg text-gray-500">Manage users, view platform metrics, and oversee operations.</p>
    </div>

    <div v-if="loading" class="animate-pulse space-y-8">
      <!-- Metrics Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="h-40 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
      </div>
      <!-- Table Skeleton -->
      <div class="h-96 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
    </div>

    <div v-else class="space-y-12">
      <!-- Metrics Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-primary rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <p class="text-sm font-bold text-gray-200 uppercase tracking-widest">Total Sales</p>
          <p class="text-4xl font-black mt-4">${{ metrics.totalSales.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col justify-between border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ metrics.totalOrders }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col justify-between border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Users</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ metrics.totalUsers }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col justify-between border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Products</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ metrics.totalProducts }}</p>
        </div>
      </div>

      <!-- Navigation Tabs (Pill Style) -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <button 
            @click="activeTab = 'users'"
            :class="[activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50', 'px-8 py-3 rounded-full text-sm font-bold transition-all']"
          >
            User Management
          </button>
          <button 
            @click="activeTab = 'orders'"
            :class="[activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50', 'px-8 py-3 rounded-full text-sm font-bold transition-all']"
          >
            Recent Orders
          </button>
        </div>
      </div>

      <!-- User Management Tab -->
      <div v-if="activeTab === 'users'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden border border-gray-100">
        <div class="px-8 py-6 flex justify-between items-center bg-surfaceAlt border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-900">Platform Users</h3>
          <div class="flex space-x-2">
             <select v-model="roleFilter" @change="fetchUsers" class="text-sm border-gray-200 rounded-full bg-white px-4 py-2 font-medium text-gray-700 shadow-sm focus:ring-primary focus:border-primary">
                <option value="">All Roles</option>
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
             </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                <th scope="col" class="relative px-8 py-4"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition-colors">
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <div class="h-12 w-12 rounded-full bg-surfaceAlt flex items-center justify-center text-primary font-bold text-lg border border-gray-100">{{ user.name.substring(0,2).toUpperCase() }}</div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-bold text-gray-900">{{ user.name }}</div>
                      <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-gray-100 text-gray-700 capitalize">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <span 
                    class="px-3 py-1 inline-flex text-xs font-bold rounded-full capitalize"
                    :class="{
                      'bg-green-100 text-green-800': user.accountStatus === 'active',
                      'bg-yellow-100 text-yellow-800': user.accountStatus === 'restricted',
                      'bg-red-100 text-red-800': user.accountStatus === 'deleted'
                    }"
                  >
                    {{ user.accountStatus }}
                  </span>
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-500">
                  {{ new Date(user.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-right text-sm font-bold">
                  <div class="flex justify-end space-x-4">
                    <button v-if="user.accountStatus !== 'active'" @click="updateUserStatus(user._id, 'active')" class="text-green-600 hover:text-green-800 transition-colors">Activate</button>
                    <button v-if="user.accountStatus !== 'restricted'" @click="updateUserStatus(user._id, 'restricted')" class="text-yellow-600 hover:text-yellow-800 transition-colors">Restrict</button>
                    <button v-if="user.accountStatus !== 'deleted'" @click="updateUserStatus(user._id, 'deleted')" class="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Orders Tab -->
      <div v-if="activeTab === 'orders'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden border border-gray-100">
        <div class="px-8 py-6 bg-surfaceAlt border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-900">Recent Global Orders</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="order in metrics.recentOrders" :key="order._id" class="hover:bg-gray-50 transition-colors">
                <td class="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-900 font-mono">{{ order._id.substring(order._id.length - 8).toUpperCase() }}</td>
                <td class="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{{ order.customer?.name || 'Unknown' }}</td>
                <td class="px-8 py-5 whitespace-nowrap text-base font-black text-primary">${{ order.totalAmount.toFixed(2) }}</td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800 capitalize">{{ order.orderStatus }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import AdminService from '../../services/admin.service';

const toast = useToast();
const loading = ref(true);
const metrics = ref(null);
const users = ref([]);
const activeTab = ref('users');
const roleFilter = ref('');

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const [metricsRes, usersRes] = await Promise.all([
      AdminService.getMetrics(),
      AdminService.getUsers({ role: roleFilter.value })
    ]);
    metrics.value = metricsRes.data;
    users.value = usersRes.data;
  } catch (error) {
    toast.error('Failed to load dashboard data');
  } finally {
    loading.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const response = await AdminService.getUsers({ role: roleFilter.value });
    users.value = response.data;
  } catch (error) {
    toast.error('Failed to fetch users');
  }
};

const updateUserStatus = async (id, status) => {
  if (status === 'deleted' && !confirm('Are you sure you want to soft delete this user?')) return;
  
  try {
    await AdminService.updateUserStatus(id, status);
    toast.success(`User status updated to ${status}`);
    await fetchUsers(); // Refresh the list
  } catch (error) {
    toast.error('Failed to update user status');
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
