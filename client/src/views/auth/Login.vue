<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <Card customClass="w-full max-w-md" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <template #header>
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p class="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
          required
        />
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-indigo-500">Forgot password?</a>
          </div>
        </div>

        <Button type="submit" class="w-full" :loading="loading">
          Sign In
        </Button>
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-primary hover:text-indigo-500">Sign up</router-link>
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as z from 'zod';
import Card from '../../components/ui/Card.vue';
import Input from '../../components/ui/Input.vue';
import Button from '../../components/ui/Button.vue';

const store = useStore();
const router = useRouter();
const toast = useToast();

const email = ref('');
const password = ref('');
const errors = ref({});
const loading = ref(false);

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const handleLogin = async () => {
  errors.value = {};
  const result = schema.safeParse({ email: email.value, password: password.value });
  
  if (!result.success) {
    result.error.issues.forEach(issue => {
      errors.value[issue.path[0]] = issue.message;
    });
    return;
  }

  loading.value = true;
  try {
    const data = await store.dispatch('auth/login', { email: email.value, password: password.value });
    toast.success('Successfully logged in!');
    
    // Redirect based on role
    if (data.user.role === 'admin') router.push('/admin/dashboard');
    else if (data.user.role === 'seller') router.push('/seller/dashboard');
    else router.push('/customer/dashboard');
    
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to login');
  } finally {
    loading.value = false;
  }
};
</script>
