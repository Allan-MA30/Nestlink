import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Home            from '@/views/Home.vue'
import Contacts        from '@/views/Contacts.vue'
import PropertyBuy     from '@/views/PropertyBuy.vue'
import PropertySell    from '@/views/PropertySell.vue'
import PropertyRent    from '@/views/PropertyRent.vue'
import SellerDashboard from '@/views/SellerDashboard.vue'
import AuthRegister    from '@/views/AuthRegister.vue'
import AuthLogin       from '@/views/AuthLogin.vue'
import AdminDashboard  from '@/views/AdminDashboard.vue'

const routes = [
  { path: '/',               component: Home },
  { path: '/contacts',       component: Contacts },
  { path: '/property/buy',   component: PropertyBuy },
  { path: '/property/sell',  component: PropertySell },
  { path: '/property/rent',  component: PropertyRent },
  { path: '/register',       component: AuthRegister },
  { path: '/login',          component: AuthLogin },

  {
    path: '/dashboard',
    component: SellerDashboard,
    meta: { requiresSeller: true }
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAdmin: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Sellers who are logged in stay on their dashboard —
  // but allow them to visit /login and /register freely
  if (auth.isSeller && !['/dashboard', '/login', '/register'].includes(to.path)) {
    return '/dashboard'
  }

  // Dashboard requires a logged-in seller
  // termsAccepted is enforced at registration time, not here
  if (to.meta.requiresSeller) {
    if (!auth.isLoggedIn || auth.user.role !== 'seller') return '/login'
  }

  // Admin panel requires a logged-in admin
  if (to.meta.requiresAdmin) {
    if (!auth.isLoggedIn || auth.user.role !== 'admin') return '/login'
  }
})

export default router