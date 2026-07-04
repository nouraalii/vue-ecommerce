<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 py-8">
    <Card customClass="w-full max-w-md" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">Create an Account</h2>
          <p class="text-sm text-gray-500 mt-1">Create your customer account</p>
        </div>
      </template>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <Input
          id="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          v-model="name"
          :error="errors.name"
          required
        />
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          v-model="email"
          :error="errors.email"
          required
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          v-model="password"
          :error="errors.password"
          hint="Must be at least 6 characters."
          required
        />

        <!-- Customer / Seller Toggle -->
        <div class="py-2">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Register as a:</label>
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              @click="role = 'customer'"
              :class="['py-2.5 rounded-full border text-sm font-bold transition-all focus:outline-none', role === 'customer' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']"
            >
              Customer
            </button>
            <button
              type="button"
              @click="role = 'seller'"
              :class="['py-2.5 rounded-full border text-sm font-bold transition-all focus:outline-none', role === 'seller' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']"
            >
              Seller (Vendor)
            </button>
          </div>
        </div>

        <!-- Seller Profile setup -->
        <div v-if="role === 'seller'" class="space-y-4 pt-3 border-t border-gray-100">
          <Input
            id="storeName"
            type="text"
            label="Store Name"
            placeholder="e.g. John's Boutique"
            v-model="storeName"
            required
          />
          <div class="flex flex-col">
            <label for="storeDescription" class="text-sm font-medium text-gray-700 mb-1">Store Description</label>
            <textarea
              id="storeDescription"
              placeholder="Briefly describe what you sell..."
              v-model="storeDescription"
              class="w-full border border-gray-300 rounded-[1.25rem] shadow-sm focus:ring-primary focus:border-primary p-3 text-sm focus:outline-none min-h-[80px]"
            ></textarea>
          </div>
        </div>

        <Button type="submit" class="w-full" :loading="loading">
          Sign Up
        </Button>

        <div class="relative flex py-1 items-center">
          <div class="flex-grow border-t border-gray-200"></div>
          <span class="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">or</span>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          type="button"
          @click="showGoogleModal = true"
          class="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-primary hover:text-indigo-500">Sign in</router-link>
        </p>
      </template>
    </Card>

    <!-- Mock Google Account Chooser Modal -->
    <div v-if="showGoogleModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4">
      <div class="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 p-8 transform transition-all duration-300">
        <div class="text-center mb-6">
          <svg class="w-8 h-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <h3 class="text-xl font-bold text-gray-900">Sign up with Google</h3>
          <p class="text-xs text-gray-500 mt-1">Choose an account to continue to eShop</p>
        </div>

        <div class="space-y-3">
          <button
            @click="handleGoogleMockSignup('john.doe@gmail.com', 'John Doe', 'g1000000000000001')"
            class="w-full flex items-center gap-3 p-3.5 border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 rounded-2xl text-left transition-all"
          >
            <div class="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">JD</div>
            <div>
              <p class="text-sm font-bold text-gray-900 leading-tight">John Doe</p>
              <p class="text-xs text-gray-500">john.doe@gmail.com</p>
            </div>
          </button>
          
          <button
            @click="handleGoogleMockSignup('alice.smith@gmail.com', 'Alice Smith', 'g1000000000000002')"
            class="w-full flex items-center gap-3 p-3.5 border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 rounded-2xl text-left transition-all"
          >
            <div class="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">AS</div>
            <div>
              <p class="text-sm font-bold text-gray-900 leading-tight">Alice Smith</p>
              <p class="text-xs text-gray-500">alice.smith@gmail.com</p>
            </div>
          </button>

          <div class="border-t border-gray-100 pt-4 mt-4">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Or use custom profile</p>
            <input
              type="text"
              placeholder="Custom Full Name"
              v-model="customGoogleName"
              class="w-full p-2.5 text-sm border border-gray-200 rounded-xl mb-2 focus:ring-primary focus:border-primary"
            />
            <input
              type="email"
              placeholder="Custom Email Address"
              v-model="customGoogleEmail"
              class="w-full p-2.5 text-sm border border-gray-200 rounded-xl mb-3 focus:ring-primary focus:border-primary"
            />
            <button
              @click="handleGoogleMockSignup(customGoogleEmail, customGoogleName, 'g_custom_' + Date.now())"
              :disabled="!customGoogleEmail || !customGoogleName"
              class="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue with Custom Account
            </button>
          </div>
        </div>

        <button
          @click="showGoogleModal = false"
          class="w-full mt-4 text-center text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-wider"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as z from 'zod';
import SellerService from '../../services/seller.service';
import Card from '../../components/ui/Card.vue';
import Input from '../../components/ui/Input.vue';
import Button from '../../components/ui/Button.vue';

const store = useStore();
const router = useRouter();
const toast = useToast();

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('customer');
const storeName = ref('');
const storeDescription = ref('');
const errors = ref({});
const loading = ref(false);

const showGoogleModal = ref(false);
const customGoogleEmail = ref('');
const customGoogleName = ref('');

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const handleRegister = async () => {
  errors.value = {};
  const result = schema.safeParse({ name: name.value, email: email.value, password: password.value });
  
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0]] = issue.message;
    });
    return;
  }

  loading.value = true;
  try {
    const payload = { 
      name: name.value, 
      email: email.value, 
      password: password.value,
      role: role.value
    };

    if (role.value === 'seller') {
      payload.storeName = storeName.value;
      payload.storeDescription = storeDescription.value;
    }

    const data = await store.dispatch('auth/register', payload);
    toast.success('Account created! Please verify your email.');
    
    // Redirect to VerifyEmail view
    router.push({ path: '/verify-email', query: { email: email.value } });
    
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to register');
  } finally {
    loading.value = false;
  }
};

const handleGoogleMockSignup = async (emailVal, nameVal, googleIdVal) => {
  showGoogleModal.value = false;
  loading.value = true;
  try {
    const data = await SellerService.googleLogin({ email: emailVal, name: nameVal, googleId: googleIdVal });
    toast.success('Successfully registered with Google!');
    
    // Log in
    store.commit('auth/loginSuccess', data);
    
    if (data.user.role === 'admin') router.push('/admin/dashboard');
    else if (data.user.role === 'seller') router.push('/seller/dashboard');
    else router.push('/customer/dashboard');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Google signup failed');
  } finally {
    loading.value = false;
  }
};
</script>
