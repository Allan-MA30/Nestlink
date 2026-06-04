<template>
  <div class="page-wrapper">
    <div class="auth-wrap">
      <div class="card auth-card">
        <button class="close-auth" type="button" @click="router.push('/')">x</button>
        <h2>Welcome back</h2>
        <p class="muted">Sign in to your account to continue</p>

        <form @submit.prevent="onSubmit" class="form">
          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" placeholder="you@domain.com" />
          </div>

          <div class="form-row">
            <label for="password">Password</label>
            <input id="password" v-model="password" type="password" placeholder="Enter your password" />
          </div>

          <div class="form-row role-row">
            <label>Sign in as</label>
              <div class="role-controls">
                <label><input type="radio" value="viewer" v-model="role" /> Viewer</label>
                <label><input type="radio" value="seller" v-model="role" /> Seller</label>
                <label><input type="radio" value="admin" v-model="role" /> Admin</label>
              </div>
          </div>

          <div v-if="error" class="error">{{ error }}</div>

          <div class="actions">
            <button class="btn-primary" type="submit">Sign in</button>
            <RouterLink :to="registerTarget" class="btn-outline">Register</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const users = useUsersStore()

const email = ref('')
const password = ref('')
const role = ref(
  route.query.role === 'seller' ? 'seller' :
  route.query.role === 'admin'  ? 'admin'  : 'viewer'
)
const error = ref('')

// Where to go after a successful login
// Priority: ?redirect= → ?next= → role-based default
const redirectTarget = computed(() => {
  if (route.query.redirect) return route.query.redirect
  if (route.query.next)     return route.query.next
  if (role.value === 'seller') return '/dashboard'
  if (role.value === 'admin')  return '/admin'
  return '/property/buy'
})

const registerTarget = computed(() => ({
  path: '/register',
  query: {
    ...(role.value === 'seller' ? { role: 'seller' } : {}),
    ...(route.query.redirect ? { redirect: route.query.redirect } : {}),
    ...(route.query.next     ? { next:     route.query.next     } : {}),
  },
}))

function onSubmit() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please provide email and password.'
    return
  }

  // ── ADMIN ──────────────────────────────────────────────────
  if (role.value === 'admin') {
    const found = users.findByEmail(email.value)
    if (!found || found.role !== 'admin' || found.password !== password.value) {
      error.value = 'Admin credentials invalid.'
      return
    }
    auth.login(found)
    router.push(redirectTarget.value)
    return
  }

  // ── SELLER ─────────────────────────────────────────────────
  if (role.value === 'seller') {
    const found = users.findByEmail(email.value)
    if (!found) {
      error.value = 'No account found. Please register first.'
      return
    }
    if (found.role !== 'seller') {
      error.value = 'This account is not a seller account.'
      return
    }
    if (found.password !== password.value) {
      error.value = 'Password incorrect.'
      return
    }
    auth.login(found)
    router.push(redirectTarget.value)
    return
  }

  // ── VIEWER ─────────────────────────────────────────────────
  const found = users.findByEmail(email.value)
  if (!found) {
    error.value = 'No account found. Please register first.'
    return
  }
  if (found.password !== password.value) {
    error.value = 'Password incorrect.'
    return
  }
  auth.login(found)
  router.push(redirectTarget.value)
}
</script>

<style scoped>
.auth-wrap { display: flex; justify-content: center; padding: 3rem 0; }
.auth-card { width: 420px; position: relative; }
.close-auth { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-size: 16px; line-height: 1; }
.close-auth:hover { color: var(--text-main); border-color: var(--gold); }
.auth-card h2 { margin-bottom: 0.25rem; }
.muted { color: var(--text-muted); margin-bottom: 1rem; }
.form { display: grid; gap: 12px; margin-top: 8px; }
.form-row label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px; }
.form-row input[type="email"], .form-row input[type="password"] {
  width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border);
  background: transparent; color: var(--text-main);
}
.role-row .role-controls { display:flex; gap:12px; align-items:center; }
.role-controls label { font-size: 13px; color: var(--text-muted); padding: 6px 8px; border-radius: 6px; }
.role-controls label:hover { background: rgba(0,0,0,0.03); }
.actions { display:flex; gap:10px; margin-top: 8px; align-items:center }
.error { color: #ff8b8b; font-size: 13px; padding: 6px 0; }
</style>