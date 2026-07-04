<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 py-12">
    <Card customClass="w-full max-w-md shadow-2xl" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <template #header>
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>
          <h2 class="text-2xl font-black text-gray-900">Verify Your Account</h2>
          <p class="text-sm text-gray-500 mt-2">
            We sent a 6-digit confirmation code to <br />
            <strong class="text-indigo-600 font-bold">{{ email }}</strong>
          </p>
        </div>
      </template>

      <form @submit.prevent="handleVerify" class="space-y-6">
        <div>
          <label class="block text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Verification Code</label>
          <input
            id="code"
            type="text"
            maxlength="6"
            pattern="[0-9]{6}"
            placeholder="••••••"
            v-model="code"
            required
            class="w-full text-center tracking-[0.75em] text-3xl font-black py-4 border border-gray-200 rounded-[2rem] bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:outline-none transition-all"
          />
          <p v-if="error" class="text-center text-sm text-red-500 mt-2 font-semibold">{{ error }}</p>
        </div>

        <Button type="submit" class="w-full py-4 rounded-full text-base font-bold shadow-lg" :loading="loading">
          Verify Account
        </Button>
      </form>

      <template #footer>
        <div class="text-center">
          <p class="text-sm text-gray-500">
            Didn't receive the email?
            <button
              @click="handleResend"
              :disabled="resendCountdown > 0 || resending"
              class="font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="resendCountdown > 0">Resend in {{ resendCountdown }}s</span>
              <span v-else-if="resending">Resending...</span>
              <span v-else class="underline">Resend Code</span>
            </button>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import SellerService from '../../services/seller.service';
import Card from '../../components/ui/Card.vue';
import Button from '../../components/ui/Button.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();
const toast = useToast();

const email = ref(route.query.email || '');
const code = ref('');
const error = ref('');
const loading = ref(false);
const resending = ref(false);
const resendCountdown = ref(0);
let timer = null;

const startCountdown = () => {
  resendCountdown.value = 60;
  timer = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

onMounted(() => {
  if (!email.value && store.getters['auth/user']) {
    email.value = store.getters['auth/user'].email;
  }
  if (!email.value) {
    toast.error('Email is missing from request');
    router.push('/login');
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const handleVerify = async () => {
  error.value = '';
  if (code.value.length !== 6) {
    error.value = 'Code must be exactly 6 digits';
    return;
  }

  loading.value = true;
  try {
    const data = await SellerService.verifyEmail(email.value, code.value);
    toast.success('Email verified successfully!');
    
    // Update token and user in Vuex store
    store.commit('auth/SET_USER', data.user);
    if (data.token) {
      store.commit('auth/loginSuccess', data);
    }
    
    // Redirect to proper dashboard
    const role = data.user.role;
    if (role === 'admin') router.push('/admin/dashboard');
    else if (role === 'seller') router.push('/seller/dashboard');
    else router.push('/customer/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Verification failed. Please check the code.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  resending.value = true;
  try {
    await SellerService.resendVerification(email.value);
    toast.success('New verification code sent! Check your logs/email.');
    startCountdown();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to resend code');
  } finally {
    resending.value = false;
  }
};
</script>
