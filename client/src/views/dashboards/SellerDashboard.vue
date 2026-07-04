<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Seller Dashboard</h1>
      <p class="mt-4 text-lg text-gray-500">Manage your store, products, orders, and earnings.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="h-40 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
      </div>
      <div class="h-96 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-10">
      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[2rem] shadow-xl p-8 text-white">
          <p class="text-xs font-bold uppercase tracking-widest text-indigo-100">Net Earnings</p>
          <p class="text-4xl font-black mt-4">${{ stats.earnings.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Available Balance</p>
          <p class="text-4xl font-black text-gray-900 mt-4">${{ stats.balance.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400">My Products</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ stats.productCount }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
          <p class="text-xs font-bold uppercase tracking-widest text-gray-400">My Orders</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ orders.length }}</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex justify-center">
        <div class="inline-flex flex-wrap justify-center bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
              'px-6 py-3 rounded-full text-sm font-bold transition-all focus:outline-none'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Overview / Store Profile Tab -->
      <section v-if="activeTab === 'overview'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border border-gray-100 p-8 max-w-3xl mx-auto">
        <h2 class="text-2xl font-black text-gray-900 mb-6">Store Settings</h2>
        <form @submit.prevent="updateStoreProfile" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700">Store Name</label>
            <input
              type="text"
              v-model="storeProfileForm.storeName"
              required
              class="mt-2 block w-full border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 text-sm p-3 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Store Description</label>
            <textarea
              v-model="storeProfileForm.storeDescription"
              class="mt-2 block w-full border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 text-sm p-3 focus:outline-none min-h-[120px] transition-all"
            ></textarea>
          </div>
          <div class="pt-4">
            <button
              type="submit"
              :disabled="savingProfile"
              class="px-8 py-3.5 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-all shadow-md disabled:opacity-50"
            >
              <span v-if="savingProfile">Saving Changes...</span>
              <span v-else>Update Profile</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Products Tab -->
      <section v-if="activeTab === 'products'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Add / Edit Product Form -->
        <form @submit.prevent="saveProduct" class="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-4 h-fit">
          <h2 class="text-xl font-bold text-gray-900">{{ productForm._id ? 'Edit Product' : 'Add New Product' }}</h2>
          
          <div class="space-y-3">
            <input v-model="productForm.title" required placeholder="Product Title (e.g. Wireless Mouse)" class="input" @input="generateSlug" />
            <input v-model="productForm.slug" required placeholder="slug-path-here" class="input" />
            <textarea v-model="productForm.description" required placeholder="Product Description" class="input min-h-[100px]"></textarea>
            <select v-model="productForm.category" required class="input">
              <option value="" disabled>Select Category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
            </select>
            <input v-model="productForm.brand" placeholder="Brand Name" class="input" />
            <div class="grid grid-cols-2 gap-3">
              <input v-model.number="productForm.basePrice" required type="number" min="0" step="0.01" placeholder="Price ($)" class="input" />
              <input v-model.number="productForm.stock" required type="number" min="0" placeholder="Stock Qty" class="input" />
            </div>
            <input v-model.number="productForm.compareAtPrice" type="number" min="0" step="0.01" placeholder="Compare At Price ($)" class="input" />
            <input v-model="productForm.imageUrl" placeholder="Image URL (http://...)" class="input" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="savingProduct" class="btn-primary w-full shadow-md">
              <span v-if="savingProduct">Saving...</span>
              <span v-else>{{ productForm._id ? 'Update' : 'Create' }}</span>
            </button>
            <button type="button" @click="resetProductForm" class="btn-secondary">Clear</button>
          </div>
        </form>

        <!-- Seller Products List -->
        <div class="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div class="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">My Catalog</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50/50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-for="product in products" :key="product._id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img :src="product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'" class="w-10 h-10 object-cover rounded-xl border border-gray-100" />
                      <div>
                        <p class="font-bold text-gray-900 leading-snug">{{ product.title }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">{{ product.category?.name || 'No category' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-bold text-gray-900">${{ Number(product.basePrice).toFixed(2) }}</td>
                  <td class="px-6 py-4 text-gray-500 text-sm font-medium">{{ product.stock }} pcs</td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize"
                      :class="{
                        'bg-yellow-100 text-yellow-800': product.status === 'pending_approval',
                        'bg-green-100 text-green-800': product.status === 'active',
                        'bg-gray-100 text-gray-800': product.status === 'draft',
                        'bg-red-100 text-red-800': product.status === 'rejected' || product.status === 'archived',
                      }"
                    >
                      {{ product.status === 'pending_approval' ? 'Pending' : product.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right space-x-3">
                    <button @click="editProduct(product)" class="text-primary font-bold hover:underline text-sm focus:outline-none">Edit</button>
                    <button v-if="product.status !== 'archived'" @click="archiveProduct(product._id)" class="text-red-600 font-bold hover:underline text-sm focus:outline-none">Archive</button>
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="5" class="text-center py-12 text-gray-400 font-medium text-sm">No products in your catalog yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Orders Tab -->
      <section v-if="activeTab === 'orders'" class="space-y-6">
        <div v-for="order in orders" :key="order._id" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden border border-gray-100">
          <div class="px-8 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50/50 border-b border-gray-100">
            <div>
              <h3 class="text-lg font-bold text-gray-900">Order #{{ order._id.substring(order._id.length - 8).toUpperCase() }}</h3>
              <p class="mt-1 text-sm font-medium text-gray-500">
                Placed by <strong>{{ order.customer?.name }}</strong> ({{ order.customer?.email }}) on {{ new Date(order.createdAt).toLocaleDateString() }}
              </p>
            </div>
            <div class="mt-4 sm:mt-0 flex items-center gap-3">
              <span class="text-sm font-bold text-gray-400">Order Status:</span>
              <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold capitalize"
                    :class="{
                      'bg-yellow-100 text-yellow-800': order.orderStatus === 'placed',
                      'bg-blue-100 text-blue-800': order.orderStatus === 'processing',
                      'bg-cyan-100 text-cyan-800': order.orderStatus === 'partially_shipped',
                      'bg-indigo-100 text-indigo-800': order.orderStatus === 'shipped',
                      'bg-green-100 text-green-800': order.orderStatus === 'delivered',
                      'bg-red-100 text-red-800': order.orderStatus === 'cancelled'
                    }">
                {{ order.orderStatus }}
              </span>
            </div>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Customer Shipping Address -->
              <div class="md:col-span-1 border-r border-gray-100 pr-8">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h4>
                <div v-if="order.shippingAddress" class="text-sm text-gray-600 space-y-1 font-medium">
                  <p>{{ order.shippingAddress.street }}</p>
                  <p>{{ order.shippingAddress.city }} - {{ order.shippingAddress.zipCode }}</p>
                  <p>{{ order.shippingAddress.country }}</p>
                </div>
                <div class="mt-6">
                  <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Mode</h4>
                  <span class="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-lg capitalize">{{ order.paymentMethod }} ({{ order.paymentStatus }})</span>
                </div>
              </div>

              <!-- Order Items Belonging to This Seller -->
              <div class="md:col-span-2">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">My Order Items</h4>
                <ul class="divide-y divide-gray-100">
                  <li v-for="item in filterSellerItems(order.items)" :key="item._id" class="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex-1">
                      <p class="font-bold text-gray-900">{{ item.name }}</p>
                      <p class="text-sm text-gray-500 font-medium mt-1">Qty: {{ item.quantity }} | Unit Price: ${{ item.price.toFixed(2) }}</p>
                    </div>

                    <div class="flex items-center gap-4">
                      <!-- Item Status Dropdown -->
                      <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Item Status</label>
                        <select
                          v-model="item.itemStatus"
                          @change="updateItemStatus(order._id, item._id, item.itemStatus)"
                          class="text-xs border border-gray-200 rounded-full bg-white px-4 py-2 font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <p class="text-lg font-black text-gray-950">${{ (item.price * item.quantity).toFixed(2) }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-if="orders.length === 0" class="text-center py-20 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
          <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          <h3 class="text-lg font-bold text-gray-900">No orders found</h3>
          <p class="text-gray-500 text-sm mt-1">Customers haven't placed orders for your products yet.</p>
        </div>
      </section>

      <!-- Earnings & Payouts Tab -->
      <section v-if="activeTab === 'earnings'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Payout Request Panel -->
        <div class="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-6 h-fit text-center">
          <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-lg font-black text-gray-900">Payout Balance</h3>
            <p class="text-3xl font-black text-primary mt-2">${{ stats.balance.toFixed(2) }}</p>
            <p class="text-xs text-gray-400 mt-1">Available for immediate withdrawal.</p>
          </div>
          <button
            @click="requestPayout"
            :disabled="stats.balance <= 0 || requestingPayoutState"
            class="w-full py-3.5 bg-primary hover:bg-secondary text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <span v-if="requestingPayoutState">Processing...</span>
            <span v-else>Request Payout</span>
          </button>
        </div>

        <!-- Payout History -->
        <div class="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div class="px-8 py-6 bg-gray-50 border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900">Payout History</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead class="bg-gray-50/50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Requested Date</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 bg-white">
                <tr v-for="payout in stats.payouts" :key="payout._id" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4 text-sm font-semibold text-gray-700">
                    {{ new Date(payout.requestedAt).toLocaleDateString() }} at {{ new Date(payout.requestedAt).toLocaleTimeString() }}
                  </td>
                  <td class="px-6 py-4 font-bold text-gray-900">${{ payout.amount.toFixed(2) }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize"
                      :class="payout.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ payout.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="stats.payouts.length === 0">
                  <td colspan="3" class="text-center py-12 text-gray-400 font-medium text-sm">No payouts requested yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import SellerService from '../../services/seller.service';
import ProductService from '../../services/product.service';

const store = useStore();
const toast = useToast();

const user = computed(() => store.getters['auth/user']);
const loading = ref(true);
const savingProfile = ref(false);
const savingProduct = ref(false);
const requestingPayoutState = ref(false);

const activeTab = ref('overview');
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'My Products' },
  { id: 'orders', label: 'My Orders' },
  { id: 'earnings', label: 'Earnings & Payouts' }
];

const stats = ref({
  storeName: '',
  description: '',
  balance: 0,
  earnings: 0,
  payouts: [],
  productCount: 0
});

const products = ref([]);
const categories = ref([]);
const orders = ref([]);

// Form states
const storeProfileForm = ref({
  storeName: '',
  storeDescription: ''
});

const defaultProductForm = {
  _id: '',
  title: '',
  slug: '',
  description: '',
  category: '',
  brand: '',
  basePrice: 0,
  compareAtPrice: 0,
  stock: 0,
  imageUrl: '',
  status: 'active'
};

const productForm = ref({ ...defaultProductForm });

onMounted(async () => {
  try {
    await Promise.all([
      fetchStats(),
      fetchProducts(),
      fetchCategories(),
      fetchOrders()
    ]);
  } catch (err) {
    toast.error('Failed to load dashboard metrics');
  } finally {
    loading.value = false;
  }
});

const fetchStats = async () => {
  const res = await SellerService.getSellerStats();
  if (res.success) {
    stats.value = res.data;
    storeProfileForm.value.storeName = res.data.storeName || '';
    storeProfileForm.value.storeDescription = res.data.description || '';
  }
};

const fetchProducts = async () => {
  if (!user.value) return;
  const res = await SellerService.getSellerProducts(user.value.id);
  if (res.success) {
    products.value = res.data;
  }
};

const fetchCategories = async () => {
  const res = await ProductService.getCategories();
  categories.value = res.data || res;
};

const fetchOrders = async () => {
  const res = await SellerService.getSellerOrders();
  if (res.success) {
    orders.value = res.data;
  }
};

const updateStoreProfile = async () => {
  savingProfile.value = true;
  try {
    const res = await SellerService.upgradeToSeller(
      storeProfileForm.value.storeName,
      storeProfileForm.value.storeDescription
    );
    if (res.success) {
      toast.success('Store profile updated successfully!');
      stats.value.storeName = storeProfileForm.value.storeName;
      stats.value.description = storeProfileForm.value.storeDescription;
      // Update role in store if it has evolved
      store.commit('auth/SET_USER', res.user);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update store profile');
  } finally {
    savingProfile.value = false;
  }
};

// Products Management
const generateSlug = () => {
  productForm.value.slug = productForm.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const editProduct = (product) => {
  productForm.value = {
    _id: product._id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    category: product.category?._id || product.category || '',
    brand: product.brand || '',
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice || 0,
    stock: product.stock,
    imageUrl: product.images?.[0]?.url || '',
    status: product.status
  };
};

const resetProductForm = () => {
  productForm.value = { ...defaultProductForm };
};

const saveProduct = async () => {
  savingProduct.value = true;
  try {
    const payload = {
      title: productForm.value.title,
      slug: productForm.value.slug,
      description: productForm.value.description,
      category: productForm.value.category,
      brand: productForm.value.brand,
      basePrice: productForm.value.basePrice,
      compareAtPrice: productForm.value.compareAtPrice || undefined,
      stock: productForm.value.stock,
      images: productForm.value.imageUrl ? [{ url: productForm.value.imageUrl, alt: productForm.value.title }] : undefined,
      status: productForm.value.status
    };

    let res;
    if (productForm.value._id) {
      res = await SellerService.updateProduct(productForm.value._id, payload);
      toast.success('Product updated successfully!');
    } else {
      res = await SellerService.createProduct(payload);
      toast.success('Product added successfully!');
    }

    if (res.success) {
      await Promise.all([fetchProducts(), fetchStats()]);
      resetProductForm();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save product');
  } finally {
    savingProduct.value = false;
  }
};

const archiveProduct = async (id) => {
  if (!confirm('Are you sure you want to archive this product?')) return;
  try {
    const res = await SellerService.archiveProduct(id);
    if (res.success) {
      toast.success('Product archived successfully!');
      await Promise.all([fetchProducts(), fetchStats()]);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to archive product');
  }
};

// Orders Management
const filterSellerItems = (items) => {
  return items.filter(item => {
    // Filter product matches seller
    const matchedProd = products.value.find(p => p._id.toString() === item.product.toString());
    return !!matchedProd;
  });
};

const updateItemStatus = async (orderId, itemId, status) => {
  try {
    const res = await SellerService.updateOrderItemStatus(orderId, itemId, status);
    if (res.success) {
      toast.success('Item status updated successfully!');
      await Promise.all([fetchOrders(), fetchStats()]);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update item status');
  }
};

// Earnings & Payouts Management
const requestPayout = async () => {
  if (stats.value.balance <= 0) return;
  requestingPayoutState.value = true;
  try {
    const res = await SellerService.requestPayout();
    if (res.success) {
      toast.success('Payout request submitted successfully!');
      await fetchStats();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to request payout');
  } finally {
    requestingPayoutState.value = false;
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  font-size: 0.875rem;
  outline: none;
  background-color: #f8fafc;
  transition: all 0.2s;
}
.input:focus {
  background-color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}
.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: #ffffff;
  font-weight: 700;
  border-radius: 1rem;
  transition: background-color 0.2s;
}
.btn-primary:hover {
  background-color: #4338ca;
}
.btn-secondary {
  padding: 0.75rem 1.5rem;
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 700;
  border-radius: 1rem;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: #e2e8f0;
}
</style>
