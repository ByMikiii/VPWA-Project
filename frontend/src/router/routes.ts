import type { RouteRecordRaw } from 'vue-router';
import { ChatState } from 'src/state/ChatState';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    meta: { title: 'Home' },
    beforeEnter: () => {
      if (!ChatState.currentUser?.email) {
        return { path: '/login' };
      }
      return true;
    }
  },

  {
    path: '/login',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
    meta: { title: 'Login' }
  },

  {
    path: '/register',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterPage.vue') }],
    meta: { title: 'Register' }
  },

  {
    path: '/forgottenPassword',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/ForgottenPassword.vue') }],
    meta: { title: 'Forgotten Password' }
  },

  {
    path: '/changePassword',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/ChangePassword.vue') }],
    meta: { title: 'Change Password' },
    beforeEnter: () => {
      if (!ChatState.currentUser?.email) {
        return { path: '/login' };
      }
      return true;
    }
  },

  {
    path: '/editProfile',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/EditProfile.vue') }],
    meta: { title: 'Edit Profile' },
    beforeEnter: () => {
      if (!ChatState.currentUser?.email) {
        return { path: '/login' };
      }
      return true;
    }
  },

  {
    path: '/profile',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProfilePage.vue') }],
    meta: { title: 'Profile' },
    beforeEnter: () => {
      if (!ChatState.currentUser?.email) {
        return { path: '/login' };
      }
      return true;
    }
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
];

export default routes;
