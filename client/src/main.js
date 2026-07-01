import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import { MotionPlugin } from '@vueuse/motion';

import 'vue-toastification/dist/index.css';
import './style.css';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(MotionPlugin);
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
});

app.mount('#app');
