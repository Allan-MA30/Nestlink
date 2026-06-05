<template>
  <div>
    <!-- Main Navbar -->
    <nav class="navbar">
      <RouterLink to="/" class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
          <rect width="32" height="32" rx="8" fill="#0a1628"/>
          <rect x="6" y="17" width="20" height="11" fill="#c9a84c"/>
          <polygon points="4,17 16,7 28,17" fill="#e8c96a"/>
          <rect x="9" y="10" width="3" height="5" fill="#e8c96a"/>
          <rect x="20" y="10" width="3" height="5" fill="#e8c96a"/>
          <rect x="13" y="22" width="6" height="6" rx="3" fill="#0a1628"/>
          <rect x="8" y="20" width="3" height="3" rx="0.5" fill="#0a1628"/>
          <rect x="21" y="20" width="3" height="3" rx="0.5" fill="#0a1628"/>
          <line x1="4" y1="17" x2="28" y2="17" stroke="#0a1628" stroke-width="1"/>
        </svg>
        <span class="logo-text">Estate<span class="logo-accent">Hub</span></span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink to="/"              class="nav-link" active-class="active">{{ settings.t('Home', 'Ahabanza') }}</RouterLink>
        <RouterLink to="/property/sell" class="nav-link" active-class="active">{{ settings.t('Property', 'Imitungo') }}</RouterLink>
        <RouterLink to="/contacts"      class="nav-link" active-class="active">{{ settings.t('Contacts', 'Twandikire') }}</RouterLink>
        <RouterLink v-if="auth.isViewer" to="/my-own"    class="nav-link" active-class="active">My Own</RouterLink>
        <RouterLink v-if="auth.isAdmin"  to="/admin"     class="nav-link" active-class="active">Admin</RouterLink>
        <RouterLink v-if="auth.isAdmin"  to="/dashboard" class="nav-link" active-class="active">Seller Dashboard</RouterLink>
        <RouterLink v-if="auth.isSeller" to="/dashboard" class="nav-link" active-class="active">Dashboard</RouterLink>
      </div>

        <div class="relative cursor-pointer">
    <span class="text-xl">🔔</span>

    <span
      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs
             rounded-full h-5 w-5 flex items-center justify-center"
    >
      {{ notificationStore.unreadCount }}
    </span>
  </div>

      <div class="nav-right">
        <button class="tool-btn" type="button" @click="settings.toggleTheme()">
          {{ settings.theme === 'dark' ? settings.t('Light', 'Urumuri') : settings.t('Black', 'Umukara') }}
        </button>
        <button class="tool-btn" type="button" @click="settings.toggleLanguage()">
          {{ settings.language === 'en' ? 'RW' : 'EN' }}
        </button>
        <template v-if="auth.isLoggedIn">
          <span class="badge-role" :class="auth.isSeller ? 'seller' : auth.isAdmin ? 'admin' : 'viewer'">
            {{ auth.isSeller ? 'Seller' : auth.isAdmin ? 'Admin' : 'Viewer' }}
          </span>
          <div class="avatar">{{ initials }}</div>
          <!-- ✅ Opens confirmation modal instead of logging out directly -->
          <button class="btn-logout" @click="showLogoutModal = true">
            {{ settings.t('Logout', 'Sohoka') }}
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login"    class="btn-outline" style="padding:7px 16px;font-size:13px;">{{ settings.t('Login', 'Injira') }}</RouterLink>
          <RouterLink to="/register" class="btn-primary" style="padding:7px 16px;font-size:13px;">{{ settings.t('Register', 'Iyandikishe') }}</RouterLink>
        </template>
      </div>
    </nav>

    <!-- Property Sub-Nav -->
    <div v-if="isPropertyRoute" class="sub-nav">
      <RouterLink to="/property/buy"  class="sub-btn buy"  active-class="active">{{ settings.t('Buy', 'Gura') }}</RouterLink>
      <RouterLink to="/property/sell" class="sub-btn sell" active-class="active">{{ settings.t('Sell', 'Gurisha') }}</RouterLink>
      <RouterLink to="/property/rent" class="sub-btn rent" active-class="active">{{ settings.t('Rent', 'Kodesha') }}</RouterLink>
    </div>

    <!-- ✅ Logout Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showLogoutModal" class="logout-backdrop" @click.self="showLogoutModal = false">
          <div class="logout-modal">
            <!-- Icon -->
            <div class="lm-icon">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="rgba(201,168,76,0.12)"/>
                <rect x="6" y="17" width="20" height="11" fill="#c9a84c"/>
                <polygon points="4,17 16,7 28,17" fill="#e8c96a"/>
                <rect x="9" y="10" width="3" height="5" fill="#e8c96a"/>
                <rect x="20" y="10" width="3" height="5" fill="#e8c96a"/>
                <rect x="13" y="22" width="6" height="6" rx="3" fill="rgba(201,168,76,0.15)"/>
                <rect x="8" y="20" width="3" height="3" rx="0.5" fill="rgba(201,168,76,0.15)"/>
                <rect x="21" y="20" width="3" height="3" rx="0.5" fill="rgba(201,168,76,0.15)"/>
              </svg>
            </div>

            <!-- Content -->
            <h2 class="lm-title">Log out of EstateHub?</h2>
            <p class="lm-sub">
              You're signed in as <strong>{{ auth.user?.name }}</strong>.<br />
              You'll need to log in again to access your account.
            </p>

            <!-- User chip -->
            <div class="lm-user-chip">
              <div class="lm-chip-avatar">{{ initials }}</div>
              <div class="lm-chip-info">
                <span class="lm-chip-name">{{ auth.user?.name }}</span>
                <span class="lm-chip-email">{{ auth.user?.email }}</span>
              </div>
              <span class="lm-chip-role" :class="auth.user?.role">{{ auth.user?.role }}</span>
            </div>

            <!-- Actions -->
            <div class="lm-actions">
              <button class="lm-btn-cancel" @click="showLogoutModal = false">
                Stay logged in
              </button>
              <button class="lm-btn-confirm" @click="confirmLogout">
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore }        from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'
import { useNotificationStore } from '@/stores/notifications'

const auth      = useAuthStore()
const route     = useRoute()
const router    = useRouter()
const settings  = useAppSettingsStore()
const notificationStore = useNotificationStore()

// Badge in the template uses notificationStore.unreadCount
// (computed getter inside the notifications store)

const showLogoutModal = ref(false)

const isPropertyRoute = computed(() => route.path.startsWith('/property'))

const initials = computed(() => {
  const name = auth.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function confirmLogout() {
  showLogoutModal.value = false
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
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.logo-icon { flex-shrink: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(201,168,76,0.25); }
.logo-text { font-size: 20px; font-weight: 700; color: var(--text-main); letter-spacing: -0.3px; }
.logo-accent { color: var(--gold); font-weight: 800; }
.nav-links { display: flex; gap: 4px; }
.nav-link { padding: 7px 16px; border-radius: 7px; font-size: 14px; color: var(--text-muted); transition: all .2s; text-decoration: none; }
.nav-link:hover, .nav-link.active { color: var(--text-main); background: var(--card); }
.nav-link.active { color: var(--gold); }
.nav-right { display: flex; align-items: center; gap: 10px; }
.tool-btn { background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 7px 10px; border-radius: 7px; font-size: 12px; cursor: pointer; font-family: var(--font); }
.tool-btn:hover { color: var(--gold); border-color: var(--gold); }
.btn-logout { background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 8px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; transition: all .2s; }
.btn-logout:hover { color: #ff6b6b; border-color: rgba(255,107,107,0.5); background: rgba(255,107,107,0.07); }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gold); color: var(--navy); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; cursor: pointer; }
.badge-role { font-size: 11px; padding: 3px 10px; border-radius: 20px; }
.badge-role.seller { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
.badge-role.viewer { background: rgba(111,186,255,0.12); color: #6fbaff; border: 1px solid rgba(111,186,255,0.25); }
.badge-role.admin  { background: rgba(167,139,250,0.14); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); }

.sub-nav { background: var(--navy-2); border-bottom: 1px solid var(--border); padding: 0 2rem; display: flex; gap: 6px; align-items: center; height: 46px; }
.sub-btn { padding: 5px 22px; border-radius: 6px; font-size: 13px; font-weight: 500; border: 1px solid transparent; transition: all .2s; text-decoration: none; }
.sub-btn.buy         { color: #6fbaff; border-color: rgba(111,186,255,0.2); }
.sub-btn.buy.active  { background: rgba(111,186,255,0.15); border-color: rgba(111,186,255,0.45); }
.sub-btn.sell        { color: var(--gold); border-color: rgba(201,168,76,0.2); }
.sub-btn.sell.active { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.45); }
.sub-btn.rent        { color: #7fe0b0; border-color: rgba(127,224,176,0.2); }
.sub-btn.rent.active { background: rgba(127,224,176,0.15); border-color: rgba(127,224,176,0.45); }

/* ── Logout Modal ────────────────────────────────────────── */
.logout-backdrop {
  position: fixed; inset: 0;
  background: rgba(5, 12, 25, 0.72);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; padding: 1rem;
}
.logout-modal {
  background: var(--navy-2);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 2rem 2rem 1.75rem;
  width: 100%; max-width: 400px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.08);
}
.lm-icon { margin-bottom: 1.25rem; display: flex; justify-content: center; }
.lm-title {
  font-size: 20px; font-weight: 700;
  color: var(--text-main); margin-bottom: .5rem;
}
.lm-sub {
  font-size: 13px; color: var(--text-muted);
  line-height: 1.65; margin-bottom: 1.25rem;
}
.lm-sub strong { color: var(--text-main); }

/* User chip */
.lm-user-chip {
  display: flex; align-items: center; gap: 10px;
  background: rgba(201,168,76,0.06);
  border: 1px solid rgba(201,168,76,0.18);
  border-radius: 10px; padding: 10px 14px;
  margin-bottom: 1.5rem; text-align: left;
}
.lm-chip-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--gold); color: var(--navy);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; flex-shrink: 0;
}
.lm-chip-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.lm-chip-name  { font-size: 13px; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lm-chip-email { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lm-chip-role {
  font-size: 10px; font-weight: 700; padding: 3px 9px;
  border-radius: 20px; text-transform: capitalize; flex-shrink: 0;
}
.lm-chip-role.seller { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
.lm-chip-role.viewer { background: rgba(111,186,255,0.12); color: #6fbaff; border: 1px solid rgba(111,186,255,0.25); }
.lm-chip-role.admin  { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); }

/* Buttons */
.lm-actions { display: flex; gap: 10px; }
.lm-btn-cancel {
  flex: 1; padding: 11px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 9px; color: var(--text-muted);
  font-family: var(--font); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .2s;
}
.lm-btn-cancel:hover { border-color: var(--gold); color: var(--text-main); }
.lm-btn-confirm {
  flex: 1; padding: 11px;
  background: rgba(255,107,107,0.12);
  border: 1px solid rgba(255,107,107,0.35);
  border-radius: 9px; color: #ff6b6b;
  font-family: var(--font); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .2s;
}
.lm-btn-confirm:hover { background: rgba(255,107,107,0.22); border-color: #ff6b6b; }

/* Transition */
.modal-fade-enter-active { transition: all .22s cubic-bezier(.4,0,.2,1); }
.modal-fade-leave-active { transition: all .18s ease; }
.modal-fade-enter-from  { opacity: 0; }
.modal-fade-leave-to    { opacity: 0; }
.modal-fade-enter-from .logout-modal { transform: scale(.94) translateY(-8px); }
.modal-fade-leave-to   .logout-modal { transform: scale(.96) translateY(-4px); }
</style>