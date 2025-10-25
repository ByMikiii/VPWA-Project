import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    meta: { title: 'Home' }
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
    meta: { title: 'Change Password' }
  },
  {
    path: '/editProfile',
    component: () => import('layouts/BaseLayout.vue'),
    children: [{ path: '', component: () => import('pages/EditProfile.vue') }],
    meta: { title: 'Edit Profile' }
  },




  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
