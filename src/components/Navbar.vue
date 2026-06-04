<template>
  <div>
    <!-- Main Navbar -->
    <nav class="navbar">
      <RouterLink to="/" class="logo">
        <!-- EstateHub Mansion Logo -->
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
          <!-- Dark background circle -->
          <rect width="32" height="32" rx="8" fill="#0a1628"/>
          <!-- Main mansion body -->
          <rect x="6" y="17" width="20" height="11" fill="#c9a84c"/>
          <!-- Mansion roof (triangle) -->
          <polygon points="4,17 16,7 28,17" fill="#e8c96a"/>
          <!-- Chimney left -->
          <rect x="9" y="10" width="3" height="5" fill="#e8c96a"/>
          <!-- Chimney right -->
          <rect x="20" y="10" width="3" height="5" fill="#e8c96a"/>
          <!-- Door -->
          <rect x="13" y="22" width="6" height="6" rx="3" fill="#0a1628"/>
          <!-- Windows left -->
          <rect x="8" y="20" width="3" height="3" rx="0.5" fill="#0a1628"/>
          <!-- Windows right -->
          <rect x="21" y="20" width="3" height="3" rx="0.5" fill="#0a1628"/>
          <!-- Roof ridge line -->
          <line x1="4" y1="17" x2="28" y2="17" stroke="#0a1628" stroke-width="1"/>
        </svg>
        <span class="logo-text">Estate<span class="logo-accent">Hub</span></span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/"              class="nav-link" active-class="active">Home</RouterLink>
        <RouterLink to="/property/sell" class="nav-link" active-class="active">Property</RouterLink>
        <RouterLink to="/contacts"      class="nav-link" active-class="active">Contacts</RouterLink>
        <!-- Dashboard only shows for sellers -->
        <RouterLink v-if="auth.isSeller" to="/dashboard" class="nav-link" active-class="active">
          Dashboard
        </RouterLink>
      </div>

      <div class="nav-right">
        <template v-if="auth.isLoggedIn">
          <span class="badge-role" :class="auth.isSeller ? 'seller' : 'viewer'">
            {{ auth.isSeller ? 'Seller' : 'Viewer' }}
          </span>
          <div class="avatar">{{ initials }}</div>
          <button class="btn-logout" @click="logout">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login"    class="btn-outline" style="padding:7px 16px;font-size:13px;">Login</RouterLink>
          <RouterLink to="/register" class="btn-primary" style="padding:7px 16px;font-size:13px;">Register</RouterLink>
        </template>
      </div>
    </nav>

    <!-- Property Sub-Nav (shows on any /property/* route) -->
    <div v-if="isPropertyRoute" class="sub-nav">
      <RouterLink to="/property/buy"  class="sub-btn buy"  active-class="active">Buy</RouterLink>
      <RouterLink to="/property/sell" class="sub-btn sell" active-class="active">Sell</RouterLink>
      <RouterLink to="/property/rent" class="sub-btn rent" active-class="active">Rent</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth   = useAuthStore()
const route  = useRoute()
const router = useRouter()

const isPropertyRoute = computed(() => route.path.startsWith('/property'))

const initials = computed(() => {
  const name = auth.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: var(--navy-2);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  flex-shrink: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(201,168,76,0.25);
}
.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.3px;
}
.logo-accent {
  color: var(--gold);
  font-weight: 800;
}
.nav-links { display: flex; gap: 4px; }
.nav-link {
  padding: 7px 16px;
  border-radius: 7px;
  font-size: 14px;
  color: var(--text-muted);
  transition: all .2s;
  text-decoration: none;
}
.nav-link:hover, .nav-link.active { color: var(--text-main); background: var(--card); }
.nav-link.active { color: var(--gold); }
.nav-right { display: flex; align-items: center; gap: 10px; }
.btn-logout {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all .2s;
}
.btn-logout:hover { color: var(--text-main); border-color: var(--text-main); }
.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--gold);
  color: var(--navy);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  cursor: pointer;
}
.badge-role {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
}
.badge-role.seller {
  background: rgba(201,168,76,0.15);
  color: var(--gold);
  border: 1px solid rgba(201,168,76,0.3);
}
.badge-role.viewer {
  background: rgba(111,186,255,0.12);
  color: #6fbaff;
  border: 1px solid rgba(111,186,255,0.25);
}

/* Sub-nav */
.sub-nav {
  background: var(--navy-2);
  border-bottom: 1px solid var(--border);
  padding: 0 2rem;
  display: flex;
  gap: 6px;
  align-items: center;
  height: 46px;
}
.sub-btn {
  padding: 5px 22px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all .2s;
  text-decoration: none;
}
.sub-btn.buy         { color: #6fbaff; border-color: rgba(111,186,255,0.2); }
.sub-btn.buy.active  { background: rgba(111,186,255,0.15); border-color: rgba(111,186,255,0.45); }
.sub-btn.sell        { color: var(--gold); border-color: rgba(201,168,76,0.2); }
.sub-btn.sell.active { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.45); }
.sub-btn.rent        { color: #7fe0b0; border-color: rgba(127,224,176,0.2); }
.sub-btn.rent.active { background: rgba(127,224,176,0.15); border-color: rgba(127,224,176,0.45); }
</style>