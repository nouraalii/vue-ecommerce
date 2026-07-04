<template>
  <div class="mt-16 pt-10 border-t border-gray-200">
    <h2 class="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-100 rounded-xl w-full"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="reviews.length === 0" class="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
      <h3 class="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
      <p class="text-gray-500 mb-4">Be the first to share your thoughts on this product.</p>
    </div>

    <!-- Reviews List -->
    <div v-else class="space-y-8 mb-12">
      <div v-for="review in reviews" :key="review._id" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center uppercase">
              {{ review.user?.name ? review.user.name.substring(0, 2) : 'A' }}
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ review.user?.name || 'Anonymous' }}</p>
              <p class="text-xs text-gray-500">{{ new Date(review.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>
          <div class="flex text-yellow-400">
            <svg v-for="i in 5" :key="i" :class="[i <= review.rating ? 'text-yellow-400' : 'text-gray-200', 'w-4 h-4']" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </div>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">{{ review.comment }}</p>
        
        <!-- Actions for Own Review -->
        <div v-if="currentUser && currentUser.id === review.user?._id" class="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="startEdit(review)" class="text-xs font-medium text-primary hover:underline">Edit</button>
          <button @click="deleteReview(review._id)" class="text-xs font-medium text-red-500 hover:underline">Delete</button>
        </div>
      </div>
    </div>

    <!-- Review Form -->
    <div v-if="isLoggedIn" class="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-100 mt-12">
      <h3 class="text-xl font-bold text-gray-900 mb-6">{{ isEditing ? 'Edit Your Review' : 'Write a Review' }}</h3>
      <form @submit.prevent="submitReview">
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Rating</label>
          <div class="flex items-center gap-1">
            <svg 
              v-for="i in 5" 
              :key="i" 
              @click="form.rating = i"
              @mouseenter="hoverRating = i"
              @mouseleave="hoverRating = 0"
              :class="[i <= (hoverRating || form.rating) ? 'text-yellow-400' : 'text-gray-300', 'w-8 h-8 cursor-pointer transition-colors']" 
              fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
        </div>
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Comment</label>
          <textarea 
            v-model="form.comment" 
            rows="4" 
            class="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-3" 
            placeholder="What did you like or dislike?"
            required
          ></textarea>
        </div>
        <div class="flex items-center gap-4">
          <button type="submit" :disabled="submitting" class="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-secondary transition-colors disabled:opacity-50">
            {{ submitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review') }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" type="button" class="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
    <div v-else class="text-center py-8 bg-gray-50 rounded-2xl mt-12">
      <p class="text-gray-600 mb-4">Please log in to write a review.</p>
      <router-link to="/login" class="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-secondary">Login</router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-all">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Delete Review</h3>
        <p class="text-gray-600 mb-8">Are you sure you want to delete this review? This action cannot be undone.</p>
        <div class="flex gap-4">
          <button @click="showDeleteModal = false" class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button @click="confirmDelete" class="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import ReviewService from '../../services/review.service';

const props = defineProps({
  productId: { type: String, required: true }
});

const store = useStore();
const toast = useToast();

const reviews = ref([]);
const loading = ref(true);
const submitting = ref(false);

const currentUser = computed(() => store.getters['auth/user']);
const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);

const form = reactive({ rating: 0, comment: '' });
const hoverRating = ref(0);
const isEditing = ref(false);
const editingId = ref(null);

const showDeleteModal = ref(false);
const reviewToDelete = ref(null);

onMounted(() => {
  loadReviews();
});

const loadReviews = async () => {
  try {
    const response = await ReviewService.getReviews(props.productId);
    reviews.value = response.data || [];
  } catch (error) {
    console.error('Error loading reviews:', error);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (form.rating === 0) {
    toast.error('Please select a rating');
    return;
  }
  
  submitting.value = true;
  try {
    if (isEditing.value) {
      await ReviewService.updateReview(props.productId, editingId.value, form);
      toast.success('Review updated successfully');
    } else {
      await ReviewService.createReview(props.productId, form);
      toast.success('Review submitted successfully');
    }
    cancelEdit();
    await loadReviews();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit review');
  } finally {
    submitting.value = false;
  }
};

const startEdit = (review) => {
  isEditing.value = true;
  editingId.value = review._id;
  form.rating = review.rating;
  form.comment = review.comment;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  form.rating = 0;
  form.comment = '';
};

const deleteReview = (id) => {
  reviewToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!reviewToDelete.value) return;
  
  try {
    await ReviewService.deleteReview(props.productId, reviewToDelete.value);
    toast.success('Review deleted');
    await loadReviews();
  } catch (error) {
    toast.error('Failed to delete review');
  } finally {
    showDeleteModal.value = false;
    reviewToDelete.value = null;
  }
};
</script>
