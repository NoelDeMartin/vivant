import '@total-typescript/ts-reset';

import vivant from 'vivant';
import { createApp } from 'vue';
import { MotionPlugin } from '@vueuse/motion';

import './assets/styles/main.css';

import App from './App.vue';
import router from './pages';
import animations from './lib/animations';

const app = createApp(App);

app.use(router);
app.use(vivant({ animations }));
app.use(MotionPlugin);
app.mount('#app');
