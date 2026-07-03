<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Admin Dashboard</h1>
      <p class="mt-4 text-lg text-gray-500">Manage users, products, categories, and orders.</p>
    </div>

    <div v-if="loading" class="animate-pulse space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="h-40 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
      </div>
      <div class="h-96 bg-white shadow-sm rounded-[2rem] border border-gray-100"></div>
    </div>

    <div v-else class="space-y-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-primary rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-8 text-white">
          <p class="text-sm font-bold text-gray-200 uppercase tracking-widest">Total Sales</p>
          <p class="text-4xl font-black mt-4">${{ metrics.totalSales.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Orders</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ orders.length }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Users</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ metrics.totalUsers }}</p>
        </div>
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Products</p>
          <p class="text-4xl font-black text-gray-900 mt-4">{{ products.length }}</p>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="inline-flex flex-wrap justify-center bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50', 'px-6 py-3 rounded-full text-sm font-bold transition-all']">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <section v-if="activeTab === 'users'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden border border-gray-100">
        <div class="px-8 py-6 flex justify-between items-center bg-surfaceAlt border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">Users</h2>
          <select v-model="roleFilter" @change="fetchUsers" class="text-sm border-gray-200 rounded-full bg-white px-4 py-2 font-medium text-gray-700 shadow-sm focus:ring-primary focus:border-primary">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead class="bg-white">
              <tr>
                <th class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th class="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th class="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="user in users" :key="user._id">
                <td class="px-8 py-5">
                  <p class="font-bold text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </td>
                <td class="px-8 py-5 capitalize">{{ user.role }}</td>
                <td class="px-8 py-5 capitalize">{{ user.accountStatus }}</td>
                <td class="px-8 py-5 text-right space-x-3">
                  <button v-if="user.accountStatus !== 'active'" @click="updateUserStatus(user._id, 'active')" class="text-green-600 font-bold">Activate</button>
                  <button v-if="user.accountStatus !== 'restricted' && !isCurrentUser(user)" @click="updateUserStatus(user._id, 'restricted')" class="text-yellow-600 font-bold">Restrict</button>
                  <button v-if="user.accountStatus !== 'deleted' && !isCurrentUser(user)" @click="updateUserStatus(user._id, 'deleted')" class="text-red-600 font-bold">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="activeTab === 'products'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form @submit.prevent="saveProduct" class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-xl font-bold text-gray-900">{{ productForm._id ? 'Edit Product' : 'Create Product' }}</h2>
          <input v-model="productForm.title" required placeholder="Title" class="input" />
          <input v-model="productForm.slug" required placeholder="Slug" class="input" />
          <textarea v-model="productForm.description" required placeholder="Description" class="input min-h-24"></textarea>
          <select v-model="productForm.category" required class="input">
            <option value="" disabled>Select category</option>
            <option v-for="category in activeCategories" :key="category._id" :value="category._id">{{ category.name }}</option>
          </select>
          <div class="grid grid-cols-2 gap-3">
            <input v-model.number="productForm.basePrice" required type="number" min="0" step="0.01" placeholder="Price" class="input" />
            <input v-model.number="productForm.stock" required type="number" min="0" placeholder="Stock" class="input" />
          </div>
          <input v-model.number="productForm.compareAtPrice" type="number" min="0" step="0.01" placeholder="Compare price" class="input" />
          <input v-model="productForm.imageUrl" placeholder="Image URL" class="input" />
          <select v-model="productForm.status" class="input">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary">{{ productForm._id ? 'Save Changes' : 'Create Product' }}</button>
            <button type="button" @click="resetProductForm" class="btn-secondary">Clear</button>
          </div>
        </form>

        <div class="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 bg-surfaceAlt border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900">Products</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <tbody class="divide-y divide-gray-100">
                <tr v-for="product in products" :key="product._id">
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">{{ product.title }}</p>
                    <p class="text-sm text-gray-500">{{ product.category?.name || 'No category' }} | {{ product.status }}</p>
                  </td>
                  <td class="px-6 py-4 font-bold">${{ Number(product.basePrice).toFixed(2) }}</td>
                  <td class="px-6 py-4">Stock {{ product.stock }}</td>
                  <td class="px-6 py-4 text-right space-x-3">
                    <button @click="editProduct(product)" class="text-primary font-bold">Edit</button>
                    <button v-if="product.status !== 'archived'" @click="archiveProduct(product._id)" class="text-red-600 font-bold">Archive</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'categories'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form @submit.prevent="saveCategory" class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-xl font-bold text-gray-900">{{ categoryForm._id ? 'Edit Category' : 'Create Category' }}</h2>
          <input v-model="categoryForm.name" required placeholder="Name" class="input" />
          <input v-model="categoryForm.slug" required placeholder="Slug" class="input" />
          <textarea v-model="categoryForm.description" placeholder="Description" class="input min-h-20"></textarea>
          <input v-model="categoryForm.imageUrl" placeholder="Image URL" class="input" />
          <select v-model="categoryForm.status" class="input">
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary">{{ categoryForm._id ? 'Save Changes' : 'Create Category' }}</button>
            <button type="button" @click="resetCategoryForm" class="btn-secondary">Clear</button>
          </div>
        </form>

        <div class="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 bg-surfaceAlt border-b border-gray-100">
            <h2 class="text-xl font-bold text-gray-900">Categories</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <tbody class="divide-y divide-gray-100">
                <tr v-for="category in categories" :key="category._id">
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">{{ category.name }}</p>
                    <p class="text-sm text-gray-500">{{ category.slug }} | {{ category.status || 'active' }}</p>
                  </td>
                  <td class="px-6 py-4 text-right space-x-3">
                    <button @click="editCategory(category)" class="text-primary font-bold">Edit</button>
                    <button v-if="category.status !== 'archived'" @click="archiveCategory(category._id)" class="text-red-600 font-bold">Archive</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'orders'" class="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden border border-gray-100">
        <div class="px-8 py-6 bg-surfaceAlt border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900">Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead>
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Order</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                <th class="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="order in orders" :key="order._id">
                <tr>
                  <td class="px-6 py-4">
                    <p class="font-mono font-bold">{{ shortId(order._id) }}</p>
                    <p class="text-sm text-gray-500">{{ order.items?.length || 0 }} items</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-bold text-gray-900">{{ order.customer?.name || 'Unknown' }}</p>
                    <p class="text-sm text-gray-500">{{ order.customer?.email || 'No email' }}</p>
                  </td>
                  <td class="px-6 py-4 font-bold">${{ Number(order.totalAmount || 0).toFixed(2) }}</td>
                  <td class="px-6 py-4">
                    <select :value="order.orderStatus" @change="updateOrder(order, { orderStatus: $event.target.value })" class="input min-w-40">
                      <option value="placed">Placed</option>
                      <option value="processing">Processing</option>
                      <option value="partially_shipped">Partially shipped</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-bold capitalize text-gray-900">{{ order.paymentStatus }}</p>
                    <p class="text-sm text-gray-500">Cash on delivery</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button @click="toggleOrderDetails(order._id)" class="text-primary font-bold">
                      {{ expandedOrderId === order._id ? 'Hide' : 'View' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="expandedOrderId === order._id" class="bg-gray-50">
                  <td colspan="6" class="px-6 py-6">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h3 class="font-bold text-gray-900 mb-3">Items</h3>
                        <ul class="space-y-3">
                          <li v-for="item in order.items" :key="item._id" class="flex justify-between text-sm">
                            <span class="text-gray-700">{{ item.name }} x {{ item.quantity }}</span>
                            <span class="font-bold text-gray-900">${{ Number((item.price || 0) * (item.quantity || 0)).toFixed(2) }}</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900 mb-3">Shipping Address</h3>
                        <p class="text-sm text-gray-700">{{ order.shippingAddress?.street || 'No street' }}</p>
                        <p class="text-sm text-gray-700">{{ order.shippingAddress?.city || 'No city' }}, {{ order.shippingAddress?.zipCode || 'No postal code' }}</p>
                        <p class="text-sm text-gray-700">{{ order.shippingAddress?.country || 'No country' }}</p>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900 mb-3">Summary</h3>
                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between"><span class="text-gray-500">Subtotal</span><span class="font-bold">${{ Number(order.subTotal || 0).toFixed(2) }}</span></div>
                          <div class="flex justify-between"><span class="text-gray-500">Shipping</span><span class="font-bold">${{ Number(order.shippingPrice || 0).toFixed(2) }}</span></div>
                          <div v-if="order.discountAmount" class="flex justify-between text-green-600"><span>Discount {{ order.promoCode ? `(${order.promoCode})` : '' }}</span><span class="font-bold">-${{ Number(order.discountAmount || 0).toFixed(2) }}</span></div>
                          <div class="flex justify-between"><span class="text-gray-500">Tax</span><span class="font-bold">${{ Number(order.tax || 0).toFixed(2) }}</span></div>
                          <div class="flex justify-between border-t border-gray-200 pt-2 text-base font-black"><span>Total</span><span>${{ Number(order.totalAmount || 0).toFixed(2) }}</span></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import AdminService from '../../services/admin.service';

const toast = useToast();
const store = useStore();
const loading = ref(true);
const metrics = ref({ totalSales: 0, totalUsers: 0, totalProducts: 0, totalOrders: 0 });
const users = ref([]);
const products = ref([]);
const categories = ref([]);
const orders = ref([]);
const activeTab = ref('users');
const roleFilter = ref('');
const expandedOrderId = ref('');

const tabs = [
  { id: 'users', label: 'Users' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'orders', label: 'Orders' }
];

const emptyProduct = () => ({
  _id: '',
  title: '',
  slug: '',
  description: '',
  category: '',
  basePrice: 0,
  compareAtPrice: '',
  stock: 0,
  imageUrl: '',
  status: 'active'
});

const emptyCategory = () => ({
  _id: '',
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  status: 'active'
});

const productForm = reactive(emptyProduct());
const categoryForm = reactive(emptyCategory());
const activeCategories = computed(() => categories.value.filter(category => (category.status || 'active') === 'active'));
const currentUser = computed(() => store.getters['auth/user']);

const shortId = id => id.substring(id.length - 8).toUpperCase();

const toggleOrderDetails = id => {
  expandedOrderId.value = expandedOrderId.value === id ? '' : id;
};

const assignForm = (target, source) => {
  Object.keys(target).forEach(key => {
    target[key] = source[key] ?? '';
  });
};

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const [metricsRes, usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
      AdminService.getMetrics(),
      AdminService.getUsers({ role: roleFilter.value }),
      AdminService.getProducts({ status: 'all', limit: 200 }),
      AdminService.getCategories({ status: 'all' }),
      AdminService.getOrders()
    ]);
    metrics.value = metricsRes.data;
    users.value = usersRes.data;
    products.value = productsRes.data;
    categories.value = categoriesRes.data;
    orders.value = ordersRes.data;
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

const isCurrentUser = user => {
  const currentUserId = currentUser.value?._id || currentUser.value?.id;
  return Boolean(currentUserId && user._id === currentUserId);
};

const refreshProducts = async () => {
  const response = await AdminService.getProducts({ status: 'all', limit: 200 });
  products.value = response.data;
};

const refreshCategories = async () => {
  const response = await AdminService.getCategories({ status: 'all' });
  categories.value = response.data;
};

const refreshOrders = async () => {
  const response = await AdminService.getOrders();
  orders.value = response.data;
};

const updateUserStatus = async (id, status) => {
  if (status === 'deleted' && !confirm('Are you sure you want to soft delete this user?')) return;
  try {
    await AdminService.updateUserStatus(id, status);
    toast.success(`User status updated to ${status}`);
    await fetchUsers();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update user status');
  }
};

const saveProduct = async () => {
  try {
    const payload = {
      title: productForm.title,
      slug: productForm.slug,
      description: productForm.description,
      category: productForm.category,
      basePrice: Number(productForm.basePrice),
      stock: Number(productForm.stock),
      status: productForm.status,
      images: productForm.imageUrl ? [{ url: productForm.imageUrl, alt: productForm.title }] : []
    };
    if (productForm.compareAtPrice !== '') payload.compareAtPrice = Number(productForm.compareAtPrice);

    if (productForm._id) await AdminService.updateProduct(productForm._id, payload);
    else await AdminService.createProduct(payload);

    toast.success('Product saved');
    resetProductForm();
    await refreshProducts();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to save product');
  }
};

const editProduct = product => {
  assignForm(productForm, {
    _id: product._id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    category: product.category?._id || product.category || '',
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice || '',
    stock: product.stock,
    imageUrl: product.images?.[0]?.url || '',
    status: product.status
  });
};

const resetProductForm = () => assignForm(productForm, emptyProduct());

const archiveProduct = async id => {
  try {
    await AdminService.archiveProduct(id);
    toast.success('Product archived');
    await refreshProducts();
  } catch (error) {
    toast.error('Failed to archive product');
  }
};

const saveCategory = async () => {
  try {
    const payload = {
      name: categoryForm.name,
      slug: categoryForm.slug,
      description: categoryForm.description,
      imageUrl: categoryForm.imageUrl,
      status: categoryForm.status
    };

    if (categoryForm._id) await AdminService.updateCategory(categoryForm._id, payload);
    else await AdminService.createCategory(payload);

    toast.success('Category saved');
    resetCategoryForm();
    await refreshCategories();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to save category');
  }
};

const editCategory = category => assignForm(categoryForm, {
  _id: category._id,
  name: category.name,
  slug: category.slug,
  description: category.description || '',
  imageUrl: category.imageUrl || '',
  status: category.status || 'active'
});

const resetCategoryForm = () => assignForm(categoryForm, emptyCategory());

const archiveCategory = async id => {
  try {
    await AdminService.archiveCategory(id);
    toast.success('Category archived');
    await refreshCategories();
  } catch (error) {
    toast.error('Failed to archive category');
  }
};

const updateOrder = async (order, statusData) => {
  try {
    await AdminService.updateOrderStatus(order._id, statusData);
    toast.success('Order updated');
    await refreshOrders();
  } catch (error) {
    toast.error('Failed to update order');
  }
};

onMounted(fetchDashboardData);
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  color: #111827;
  font-size: 0.875rem;
}

.btn-primary {
  flex: 1;
  border-radius: 0.75rem;
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1rem;
  font-weight: 800;
}

.btn-secondary {
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  padding: 0.75rem 1rem;
  font-weight: 800;
}
</style>
