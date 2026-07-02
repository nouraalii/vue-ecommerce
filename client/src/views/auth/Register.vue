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
        <Button type="submit" class="w-full" :loading="loading">
          Sign Up
        </Button>
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-primary hover:text-indigo-500">Sign in</router-link>
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

const name = ref('');
const email = ref('');
const password = ref('');
const errors = ref({});
const loading = ref(false);

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
    const data = await store.dispatch('auth/register', { 
      name: name.value, 
      email: email.value, 
      password: password.value
    });
    toast.success('Account created successfully!');
    router.push('/customer/dashboard');
    
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to register');
  } finally {
    loading.value = false;
  }
};
</script>
