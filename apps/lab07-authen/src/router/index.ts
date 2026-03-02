import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginView from "@/views/LoginPage.vue"
import { authService } from '@/auth/auth-service';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: "/login",
    component: LoginView,
  },
  {
    path: '/tabs',   // ✅ ไม่มี /
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const user = await authService.getCurrentUser();

  if (to.meta.requiresAuth && !user) return "/login";
  if (to.path === "/login" && user) return "/tabs/tab1";

  return true;
});

export default router;
