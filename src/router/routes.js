
const routes = [
  { // Auth Routes
    path: '/auth',
    redirect: 'auth/sign-in',
    component: () => import('layouts/auth'),
    children: [{
      path: 'sign-in',
      name: 'signIn',
      component: () => import('pages/auth/sign-in')
    }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/Index.vue')
      }
    ]
  },
  {
    path: '/account-management',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'account-management',
        component: () => import('pages/AccountManagement.vue')
      }
    ]
  },
  {
    path: '/transactions',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'transactions',
        component: () => import('pages/Transactions.vue')
      }
    ]
  },
  {
    path: '/deposits',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'deposits',
        component: () => import('pages/Deposits.vue')
      }
    ]
  },
  {
    path: '/management',
    component: () => import('layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'management',
        component: () => import('pages/Management.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
