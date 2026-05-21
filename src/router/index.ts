import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '@/pages/DashboardPage.vue';
import EntryPage from '@/pages/EntryPage.vue';
import CollectionPage from '@/pages/CollectionPage.vue';
import MapPage from '@/pages/MapPage.vue';
import FriendsFollowingPage from '@/pages/FriendsFollowingPage.vue';
import FriendsAllUserPage from '@/pages/FriendsAllUserPage.vue';
import { pb } from '@/services/pocketbase';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardPage,
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/add',
      name: 'spot-entry',
      component: EntryPage,
      meta: {
        title: 'Eintragen',
        requiresAuth: true,
      },
    },
    {
      path: '/spots',
      name: 'spots',
      component: CollectionPage,
      meta: {
        title: 'Collection',
        requiresAuth: true,
      },
    },
    {
      path: '/spots/:id',
      name: 'spot-detail',
      component: () => import('@/pages/SpotDetailPage.vue'),
      meta: {
        title: 'Spot-Details',
        requiresAuth: true,
      },
    },
    {
      path: '/map',
      name: 'map',
      component: MapPage,
      meta: {
        title: 'Karte',
        requiresAuth: true,
      },
    },

    {
      path: '/friendsAll',
      name: 'friendsAll',
      component: FriendsAllUserPage,
      meta: {
        title: 'Alle User',
        requiresAuth: true,
      },
    },
    {
      path: '/friends',
      name: 'friends',
      component: FriendsFollowingPage,
      meta: {
        title: 'Freundesliste',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: {
        title: 'Login',
        requiresAuth: false,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: {
        title: '404',
        requiresAuth: false,
      },
    },
  ],
});

router.beforeEach(to => {
  if (to.meta.requiresAuth && !pb.authStore.isValid) {
    return {
      name: 'login',
    };
  }
});

router.afterEach((to, from) => {
  const navOrder = ['dashboard', 'spots', 'spot-entry', 'map'];

  const toIndex = navOrder.indexOf(String(to.name));
  const fromIndex = navOrder.indexOf(String(from.name));

  if (toIndex === -1 || fromIndex === -1) {
    to.meta.transition = 'fade';
    return;
  }

  if (toIndex > fromIndex) {
    to.meta.transition = 'slide-left';
    return;
  }

  if (toIndex < fromIndex) {
    to.meta.transition = 'slide-right';
    return;
  }

  to.meta.transition = '';
});

export default router;
