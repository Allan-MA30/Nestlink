<template>
  <div class="page-wrapper">
    <div class="auth-wrap">
      <div class="card auth-card">
        <button class="close-auth" type="button" @click="router.push('/')">x</button>
        <h2>Create an account</h2>
        <p class="muted">Register to list or browse properties</p>

        <form @submit.prevent="onSubmit" class="form">
          <div class="form-row">
            <label for="name">Full name</label>
            <input id="name" v-model="name" type="text" placeholder="Your full name" />
          </div>

          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" placeholder="you@domain.com" />
          </div>

          <div class="form-row">
            <label for="password">Password</label>
            <input id="password" v-model="password" type="password" placeholder="Choose a password" />
          </div>

          <div v-if="role !== 'viewer'" class="form-row">
            <label>Profile picture (optional)</label>
            <div class="profile-upload">
              <div v-if="profilePreview" class="profile-preview">
                <img :src="profilePreview" class="preview-img-large" />
                <input id="profile" type="file" accept="image/*" @change="handleFile" class="file-input-overlay" title="Click to change" />
              </div>
              <div v-else class="profile-placeholder">
                <div class="placeholder-text">{{ name ? name.charAt(0).toUpperCase() : '?' }}</div>
                <input id="profile" type="file" accept="image/*" @change="handleFile" class="file-input-overlay" />
              </div>
            </div>
          </div>

          <div class="form-row role-row">
            <label>Account type</label>
            <div class="role-controls">
              <label><input type="radio" value="viewer" v-model="role" /> Viewer</label>
              <label><input type="radio" value="seller" v-model="role" /> Seller</label>
              <label><input type="radio" value="admin" v-model="role" /> Admin</label>
            </div>
          </div>

          <div v-if="role === 'admin'" class="form-row">
            <label for="adminkey">Admin key</label>
            <input id="adminkey" v-model="adminKey" type="password" placeholder="Enter admin key" />
          </div>

          <div v-if="role === 'seller'" class="terms-row">
            <div class="terms-title">Terms and conditions</div>
            <div class="terms-items">

              <!-- All three terms are display-only (disabled checked) -->
              <label class="terms-check">
                <input type="checkbox" disabled checked />
                <span>
                  1) On the bought product, <strong>5% will be gained</strong> by the website company.
                </span>
              </label>

              <label class="terms-check">
                <input type="checkbox" disabled checked />
                <span>
                  2) If you are found to lie that you have a property, <strong>you will be punished by law</strong>.
                </span>
              </label>

              <label class="terms-check">
                <input type="checkbox" disabled checked />
                <span>
                  3) You have to answer customers in <strong>not more than 1 day</strong>. Failure adds <strong>extra fines</strong>.
                </span>
              </label>
            </div>

            <!-- Only this one checkbox controls termsAccepted -->
            <div class="terms-confirm">
              <label class="terms-check">
                <input type="checkbox" v-model="termsAccepted" />
                <span>I confirm that I agree to all the terms above.</span>
              </label>
            </div>
          </div>

          <div v-if="error" class="error">{{ error }}</div>

          <div class="actions">
            <button class="btn-primary" type="submit">Create account</button>
            <RouterLink :to="loginTarget" class="btn-outline">Sign in</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const users = useUsersStore()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('viewer')
const adminKey = ref('')
const error = ref('')
const termsAccepted = ref(false)
const profilePreview = ref('')
const profilePicture = ref('')

// Where to go after successful registration
// Sellers and admins always go to their dashboard regardless of query params
const redirectTarget = computed(() => {
  if (role.value === 'seller') return '/dashboard'
  if (role.value === 'admin')  return '/admin'
  if (route.query.redirect) return route.query.redirect
  if (route.query.next)     return route.query.next
  return '/property/buy'
})

const loginTarget = computed(() => ({
  path: '/login',
  query: {
    ...(role.value === 'seller' ? { role: 'seller' } : {}),
    ...(route.query.redirect ? { redirect: route.query.redirect } : {}),
    ...(route.query.next     ? { next:     route.query.next     } : {}),
  },
}))

// Preselect role from query (e.g. /register?role=seller)
if (route.query.role === 'seller') role.value = 'seller'
if (route.query.role === 'admin')  role.value = 'admin'

// Clear profile picture and terms when switching to viewer
watch(role, (newRole) => {
  if (newRole === 'viewer') {
    profilePreview.value = ''
    profilePicture.value = ''
    termsAccepted.value = false
  }
})

function onSubmit() {
  error.value = ''

  if (!name.value || !email.value || !password.value) {
    error.value = 'Please complete all fields.'
    return
  }

  if (users.findByEmail(email.value)) {
    error.value = 'Email already registered.'
    return
  }

  if (role.value === 'admin') {
    if (!adminKey.value || adminKey.value !== 'ADMIN2025') {
      error.value = 'Invalid admin key.'
      return
    }
  }

  if (role.value === 'seller' && !termsAccepted.value) {
    error.value = 'You must accept the Terms and conditions to continue.'
    return
  }

  const userData = {
    id: Date.now(),
    name: name.value,
    email: email.value,
    role: role.value,
    password: password.value,
    profilePicture: profilePicture.value,
    ...(role.value === 'seller' ? { termsAccepted: true } : {}),
  }

  users.addUser(userData)
  auth.register({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    ...(userData.role === 'seller' ? { termsAccepted: true } : {}),
  })

  // Redirect respects ?redirect= / ?next= then falls back to role default
  router.push(redirectTarget.value)
}

function handleFile(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => {
    profilePreview.value = reader.result
    profilePicture.value = reader.result
  }
  reader.readAsDataURL(f)
}
</script>

<style scoped>
.auth-wrap { display: flex; justify-content: center; padding: 3rem 0; }
.auth-card { width: 460px; position: relative; }
.close-auth { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-size: 16px; line-height: 1; }
.close-auth:hover { color: var(--text-main); border-color: var(--gold); }
.auth-card h2 { margin-bottom: 0.25rem; }
.muted { color: var(--text-muted); margin-bottom: 1rem; }
.form { display: grid; gap: 12px; margin-top: 8px; }
.form-row label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px; }
.terms-row { padding: 10px 12px; background: rgba(201,168,76,0.06); border: 1px solid var(--border); border-radius: 10px; }
.terms-title { font-weight: 800; color: var(--gold); margin-bottom: 8px; }
.terms-items { display: flex; flex-direction: column; gap: 8px; }
.terms-check { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--text-main); }
.terms-check input { margin-top: 3px; }
.terms-confirm { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.form-row input[type="text"], .form-row input[type="email"], .form-row input[type="password"] {
  width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border);
  background: transparent; color: var(--text-main);
}
.role-row .role-controls { display:flex; gap:12px; align-items:center; }
.role-controls label { font-size: 13px; color: var(--text-muted); padding: 6px 8px; border-radius: 6px; }
.role-controls label:hover { background: rgba(0,0,0,0.03); }
.actions { display:flex; gap:10px; margin-top: 8px; align-items:center }
.error { color: #ff8b8b; font-size: 13px; padding: 6px 0; }
.profile-section { display:flex; align-items:center; gap:12px; margin-top:8px }
.placeholder-logo { width:48px; height:48px; border-radius:4px; background:linear-gradient(135deg, #c9a84c 0%, #9d8b3f 100%); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:18px; flex-shrink:0 }
.preview-container { display:flex; align-items:center; gap:8px }
.preview-logo { width:48px; height:48px; border-radius:4px; object-fit:cover; flex-shrink:0 }
.btn-change { background:#c9a84c; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-size:12px; font-weight:600; cursor:pointer; transition:opacity .2s }
.btn-change:hover { opacity:.85 }
.file-input { flex:1 }
</style>