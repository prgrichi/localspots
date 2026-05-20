import { createApp } from 'vue';
import { createPinia } from 'pinia';
import naive from 'naive-ui';
import App from './App.vue';
import router from './router';
import 'leaflet/dist/leaflet.css';
import './main.css';
import { useAuthStore } from '@/stores/authStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const authStore = useAuthStore(pinia);
authStore.initAuth();

app.use(naive);
app.use(router);
app.mount('#app');
