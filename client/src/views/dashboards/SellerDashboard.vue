<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Seller Dashboard</h1>
      <p class="mt-4 text-lg text-gray-500 font-medium">Welcome back, <span class="text-primary">{{ user?.sellerDetails?.storeName || user?.name }}</span></p>
    </div>

    <div v-if="loading" class="animate-pulse space-y-8">
      <!-- Metrics Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-40 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
      </div>
      <div class="h-96 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
    </div>

    <div v-else class="space-y-12">
      <!-- Metrics Section -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div class="bg-primary rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <p class="text-sm font-bold text-gray-200 uppercase tracking-widest">Total Earnings</p>
          <p class="text-4xl font-black mt-4">${{ metrics.totalSales.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col justify-between border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">My Products</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ metrics.totalProducts }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col justify-between border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Orders</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ metrics.recentOrders.length }}</p>
        </div>
      </div>

      <!-- Navigation Tabs (Pill Style) -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <button @click="activeTab = 'products'" :class="[activeTab === 'products' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50', 'px-8 py-3 rounded-full text-sm font-bold transition-all']">My Products</button>
          <button @click="activeTab = 'orders'" :class="[activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50', 'px-8 py-3 rounded-full text-sm font-bold transition-all']">Order Fulfillment</button>
          <button @click="activeTab = 'settings'" :class="[activeTab === 'settings' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50', 'px-8 py-3 rounded-full text-sm font-bold transition-all']">Store Settings</button>
        </div>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden border border-gray-100">
        <div class="px-8 py-6 flex justify-between items-center bg-surfaceAlt border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-900">Inventory Management</h3>
          <button @click="showAddProductModal = true" class="inline-flex items-center px-6 py-2.5 shadow-md text-sm font-bold rounded-full text-white bg-primary hover:bg-secondary transition-all transform hover:-translate-y-0.5">Add Product</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th scope="col" class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="product in products" :key="product._id" class="hover:bg-gray-50 transition-colors">
                <td class="px-8 py-5 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-16 w-16">
                      <img class="h-16 w-16 rounded-2xl object-cover bg-gray-50 border border-gray-100" :src="product.images?.[0]?.url || 'https://placehold.co/100'" alt="" />
                    </div>
                    <div class="ml-4">
                      <div class="text-base font-bold text-gray-900">{{ product.title }}</div>
                      <div class="text-sm font-medium text-gray-500">{{ product.category?.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5 whitespace-nowrap text-base font-bold text-gray-900">${{ product.basePrice.toFixed(2) }}</td>
                <td class="px-8 py-5 whitespace-nowrap text-base font-bold" :class="product.stock > 0 ? 'text-gray-900' : 'text-red-500'">{{ product.stock }}</td>
                <td class="px-8 py-5 whitespace-nowrap">
                  <span class="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-800 capitalize">{{ product.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border border-gray-100 p-12 text-center text-gray-400 font-medium">
         [ Order Fulfillment View Placeholder ]<br/>
         <span class="text-sm">Here sellers can see orders containing their products and update tracking info.</span>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border border-gray-100 p-8 max-w-2xl mx-auto">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Store Settings</h3>
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
            <input type="text" v-model="profileForm.storeName" class="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary py-3 px-4 border bg-gray-50 text-gray-900 font-medium" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Store Description</label>
            <textarea v-model="profileForm.description" rows="4" class="block w-full border-gray-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary py-3 px-4 border bg-gray-50 text-gray-900 font-medium"></textarea>
          </div>
          <button type="submit" class="w-full justify-center py-4 px-4 border border-transparent shadow-md text-base font-bold rounded-xl text-white bg-primary hover:bg-secondary transition-all">Save Changes</button>
        </form>
      </div>

    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="showAddProductModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-[2rem] px-8 pt-8 pb-8 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-gray-100">
          <div>
            <h3 class="text-2xl font-extrabold text-gray-900 mb-6">Add New Product</h3>
            <form @submit.prevent="submitProduct" class="space-y-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input type="text" v-model="productForm.title" required class="block w-full border-gray-200 rounded-xl py-3 px-4 border bg-gray-50 focus:ring-primary focus:border-primary text-gray-900 font-medium" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Slug</label>
                <input type="text" v-model="productForm.slug" required class="block w-full border-gray-200 rounded-xl py-3 px-4 border bg-gray-50 focus:ring-primary focus:border-primary text-gray-900 font-medium" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea v-model="productForm.description" required class="block w-full border-gray-200 rounded-xl py-3 px-4 border bg-gray-50 focus:ring-primary focus:border-primary text-gray-900 font-medium"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input type="number" step="0.01" v-model="productForm.basePrice" required class="block w-full border-gray-200 rounded-xl py-3 px-4 border bg-gray-50 focus:ring-primary focus:border-primary text-gray-900 font-medium" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                  <input type="number" v-model="productForm.stock" required class="block w-full border-gray-200 rounded-xl py-3 px-4 border bg-gray-50 focus:ring-primary focus:border-primary text-gray-900 font-medium" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Category ID</label>
                <input type="text" v-model="productForm.category" required class="block w-full border-gray-200 rounded-xl py-3 px-4 border bg-gray-50 focus:ring-primary focus:border-primary text-gray-900 font-medium" placeholder="Mongo ObjectID of Category" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Product Image</label>
                <input type="file" @change="handleFileChange" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-secondary cursor-pointer" />
              </div>
              
              <div class="mt-8 sm:grid sm:grid-cols-2 sm:gap-4 sm:grid-flow-row-dense">
                <button type="submit" :disabled="submittingProduct" class="w-full inline-flex justify-center rounded-xl shadow-md px-6 py-3.5 bg-primary text-base font-bold text-white hover:bg-secondary sm:col-start-2 transition-all">
                  {{ submittingProduct ? 'Saving...' : 'Save Product' }}
                </button>
                <button type="button" @click="showAddProductModal = false" class="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-200 px-6 py-3.5 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import SellerService from '../../services/seller.service';

const store = useStore();
const toast = useToast();
const user = computed(() => store.getters['auth/user']);

const loading = ref(true);
const metrics = ref(null);
const products = ref([]);
const activeTab = ref('products');

const profileForm = reactive({
  storeName: '',
  description: ''
});

const showAddProductModal = ref(false);
const submittingProduct = ref(false);
const productForm = reactive({
  title: '',
  slug: '',
  description: '',
  basePrice: 0,
  stock: 0,
  category: ''
});
const selectedFile = ref(null);

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const [metricsRes, productsRes] = await Promise.all([
      SellerService.getMetrics(),
      SellerService.getProducts()
    ]);
    metrics.value = metricsRes.data;
    products.value = productsRes.data;
    
    profileForm.storeName = user.value?.sellerDetails?.storeName || '';
    profileForm.description = user.value?.sellerDetails?.description || '';
  } catch (error) {
    toast.error('Failed to load dashboard data');
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  try {
    await SellerService.updateProfile(profileForm);
    toast.success('Store profile updated');
    // We should ideally update the Vuex store here too, but re-fetching works
  } catch (err) {
    toast.error('Failed to update profile');
  }
};

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const submitProduct = async () => {
  submittingProduct.value = true;
  try {
    const formData = new FormData();
    Object.keys(productForm).forEach(key => formData.append(key, productForm[key]));
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    await SellerService.createProduct(formData);
    toast.success('Product added successfully!');
    showAddProductModal.value = false;
    
    // Refresh products
    const productsRes = await SellerService.getProducts();
    products.value = productsRes.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to add product');
  } finally {
    submittingProduct.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
