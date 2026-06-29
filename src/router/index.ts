import { createRouter, createWebHistory } from 'vue-router';
import ActivitiesPage from '@/pages/ActivitiesPage.vue';
// import MapPage from '@/pages/MapPage.vue';
import { pb } from '@/services/pocketbase';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'activities',
      component: ActivitiesPage,
      meta: {
        title: 'Activities',
        requiresAuth: true,
      },
    },
    {
      path: '/add',
      name: 'add-entry',
      component: () => import('@/pages/EntryPage.vue'),
      meta: {
        title: 'Eintragen',
        requiresAuth: true,
      },
    },
    {
      path: '/spots',
      name: 'spots',
      component: () => import('@/pages/SpotPage.vue'),
      meta: {
        title: 'Spots',
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
    // {
    //   path: '/map',
    //   name: 'map',
    //   component: MapPage,
    //   meta: {
    //     title: 'Karte',
    //     requiresAuth: true,
    //   },
    // },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/pages/MapPage.vue'),
      meta: {
        title: 'Karte',
        requiresAuth: true,
      },
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import('@/pages/CollectionsPage.vue'),
      meta: {
        title: 'Collections',
        requiresAuth: true,
      },
    },
    {
      path: '/all-collections',
      name: 'all-collections',
      component: () => import('@/pages/AllCollectionsPage.vue'),
      meta: {
        title: 'Alle Collections',
        requiresAuth: true,
      },
    },
    {
      path: '/my-collections',
      name: 'my-collections',
      component: () => import('@/pages/MyCollectionsPage.vue'),
      meta: {
        title: 'Meine Collections',
        requiresAuth: true,
      },
    },
    {
      path: '/friends-all',
      name: 'friends-all',
      component: () => import('@/pages/FriendsAllUserPage.vue'),
      meta: {
        title: 'Alle User',
        requiresAuth: true,
      },
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/pages/FriendsFollowingPage.vue'),
      meta: {
        title: 'Freundesliste',
        requiresAuth: true,
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/pages/FavoritesPage.vue'),
      meta: {
        title: 'Favoriten',
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
  void from;
  to.meta.transition = 'fade';
});

export default router;
