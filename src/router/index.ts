import { createRouter, createWebHistory } from 'vue-router';
import WebEditor from '@/views/web-editor.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WebEditor
    }
  ]
});

export default router;
