<template>
  <div class="admin-shell">

    <!-- ── TOP BAR (replaces global Navbar for admins) ─────────── -->
    <header class="topbar">
      <div class="topbar-left">
        <RouterLink to="/" class="topbar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#0a1628"/>
            <rect x="6" y="17" width="20" height="11" fill="#c9a84c"/>
            <polygon points="4,17 16,7 28,17" fill="#e8c96a"/>
            <rect x="9" y="10" width="3" height="5" fill="#e8c96a"/>
            <rect x="20" y="10" width="3" height="5" fill="#e8c96a"/>
            <rect x="13" y="22" width="6" height="6" rx="3" fill="#0a1628"/>
            <rect x="8" y="20" width="3" height="3" rx="0.5" fill="#0a1628"/>
            <rect x="21" y="20" width="3" height="3" rx="0.5" fill="#0a1628"/>
          </svg>
          <span class="topbar-brand">Estate<span>Hub</span></span>
        </RouterLink>
        <div class="topbar-divider"></div>
        <span class="topbar-section">Admin Console</span>
      </div>
      <div class="topbar-right">
        <div class="topbar-stat">
          <span class="ts-val">{{ users.users.length }}</span>
          <span class="ts-label">Total Users</span>
        </div>
        <div class="topbar-stat">
          <span class="ts-val">{{ sellerCount }}</span>
          <span class="ts-label">Sellers</span>
        </div>
        <div class="topbar-stat">
          <span class="ts-val">{{ viewerCount }}</span>
          <span class="ts-label">Viewers</span>
        </div>
        <!-- Theme & Language toggles -->
        <button class="tool-btn" @click="settings.toggleTheme()">
          {{ settings.theme === 'dark' ? '☀️' : '🌙' }}
        </button>
        <button class="tool-btn" @click="settings.toggleLanguage()">
          {{ settings.language === 'en' ? 'RW' : 'EN' }}
        </button>
        <!-- Admin badge + logout -->
        <div class="admin-badge">
          <div class="admin-avatar">{{ adminInitials }}</div>
          <span>Admin</span>
        </div>
        <!-- ✅ Logout button opens confirmation modal -->
        <button class="topbar-logout" @click="showLogoutModal = true">
          Logout
        </button>
      </div>
    </header>

    <!-- ── MAIN ──────────────────────────────────────────────────── -->
    <main class="admin-main">

      <!-- Panel header -->
      <div class="panel-header">
        <div class="panel-title-block">
          <h1 class="panel-title">User Management</h1>
          <p class="panel-sub">{{ filteredUsers.length }} of {{ users.users.length }} users shown</p>
        </div>
        <button class="btn-add" @click="showAdd = !showAdd">
          <span class="btn-add-icon">{{ showAdd ? '✕' : '+' }}</span>
          {{ showAdd ? 'Close' : 'Add User' }}
        </button>
      </div>

      <!-- ── ADD USER FORM ─────────────────────────────────────── -->
      <Transition name="slide-down">
        <div v-if="showAdd" class="add-panel">
          <div class="add-panel-title">New User</div>
          <div class="add-grid">
            <div class="add-field">
              <label>Full Name</label>
              <input v-model="newUser.name" placeholder="e.g. Alice Uwase" class="field-input" />
            </div>
            <div class="add-field">
              <label>Email</label>
              <input v-model="newUser.email" placeholder="alice@email.com" class="field-input" />
            </div>
            <div class="add-field">
              <label>Password</label>
              <input v-model="newUser.password" type="password" placeholder="••••••••" class="field-input" />
            </div>
            <div class="add-field">
              <label>Role</label>
              <select v-model="newUser.role" class="field-input field-select">
                <option value="viewer">Viewer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="add-field add-field-upload">
              <label>Profile Photo</label>
              <div class="upload-row">
                <div class="mini-avatar">
                  <img v-if="newUser.profilePicture" :src="newUser.profilePicture" class="mini-avatar-img" />
                  <span v-else>{{ newUser.name ? newUser.name[0].toUpperCase() : '?' }}</span>
                </div>
                <label class="btn-upload">
                  Choose file
                  <input type="file" accept="image/*" class="hidden-input" @change="handleAddFile" />
                </label>
              </div>
            </div>
          </div>
          <div class="add-footer">
            <button class="btn-cancel-add" @click="showAdd = false">Cancel</button>
            <button class="btn-create" @click="addUser">Create User</button>
          </div>
        </div>
      </Transition>

      <!-- ── FILTERS ───────────────────────────────────────────── -->
      <div class="filters-row">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input v-model="search" placeholder="Search by name or email…" class="search-input" />
        </div>
        <div class="role-pills">
          <button
            v-for="r in roleOptions" :key="r.value"
            class="role-pill"
            :class="{ active: filterRole === r.value }"
            @click="filterRole = r.value"
          >{{ r.label }}</button>
        </div>
      </div>

      <!-- ── USER TABLE ─────────────────────────────────────────── -->
      <div class="table-wrap">
        <table class="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(u, idx) in filteredUsers"
              :key="u.id"
              class="user-row"
              :style="{ '--delay': idx * 0.04 + 's' }"
            >
              <!-- User cell -->
              <td>
                <div class="user-cell">
                  <div class="row-avatar" :class="'role-' + u.role">
                    <img v-if="u.profilePicture" :src="u.profilePicture" class="row-avatar-img" />
                    <span v-else>{{ u.name ? u.name[0].toUpperCase() : '?' }}</span>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ u.name }}</span>
                    <span class="user-id">ID: {{ u.id }}</span>
                  </div>
                </div>
              </td>
              <td class="email-cell">{{ u.email }}</td>
              <td>
                <select v-model="u.role" @change="changeRole(u)" class="role-select" :class="'rs-' + u.role">
                  <option value="viewer">Viewer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td><span class="status-dot active-dot">● Active</span></td>
              <td>
                <div class="actions-cell">
                  <label class="action-btn photo-btn" title="Change photo">
                    📷
                    <input type="file" accept="image/*" class="hidden-input" @change="onRowFileChange($event, u)" />
                  </label>
                  <button class="action-btn pw-btn" @click="resetPassword(u)" title="Reset password">🔑</button>
                  <button
                    class="action-btn del-btn"
                    :class="{ disabled: u.email === currentUser.email }"
                    :disabled="u.email === currentUser.email"
                    @click="remove(u)"
                    title="Delete user"
                  >🗑</button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="empty-row">
                <div class="empty-state">
                  <div class="empty-icon">👥</div>
                  <p>No users match your filters.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── FOOTER STATS ──────────────────────────────────────── -->
      <div class="footer-stats">
        <div class="fs-item" v-for="stat in footerStats" :key="stat.label">
          <span class="fs-val">{{ stat.val }}</span>
          <span class="fs-label">{{ stat.label }}</span>
        </div>
      </div>

    </main>

    <!-- ✅ Logout Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showLogoutModal" class="logout-backdrop" @click.self="showLogoutModal = false">
          <div class="logout-modal">
            <div class="lm-icon">
              <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="rgba(201,168,76,0.12)"/>
                <rect x="6" y="17" width="20" height="11" fill="#c9a84c"/>
                <polygon points="4,17 16,7 28,17" fill="#e8c96a"/>
                <rect x="9" y="10" width="3" height="5" fill="#e8c96a"/>
                <rect x="20" y="10" width="3" height="5" fill="#e8c96a"/>
                <rect x="13" y="22" width="6" height="6" rx="3" fill="rgba(201,168,76,0.2)"/>
                <rect x="8" y="20" width="3" height="3" rx="0.5" fill="rgba(201,168,76,0.2)"/>
                <rect x="21" y="20" width="3" height="3" rx="0.5" fill="rgba(201,168,76,0.2)"/>
              </svg>
            </div>

            <h2 class="lm-title">Log out of EstateHub?</h2>
            <p class="lm-sub">
              You're signed in as <strong>{{ auth.user?.name }}</strong>.<br />
              You'll need your admin credentials to log back in.
            </p>

            <div class="lm-user-chip">
              <div class="lm-chip-avatar">{{ adminInitials }}</div>
              <div class="lm-chip-info">
                <span class="lm-chip-name">{{ auth.user?.name }}</span>
                <span class="lm-chip-email">{{ auth.user?.email }}</span>
              </div>
              <span class="lm-chip-role admin">admin</span>
            </div>

            <div class="lm-actions">
              <button class="lm-btn-cancel" @click="showLogoutModal = false">Stay logged in</button>
              <button class="lm-btn-confirm" @click="confirmLogout">Yes, log out</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter }          from 'vue-router'
import { useUsersStore }      from '@/stores/users'
import { useAuthStore }       from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'

const users       = useUsersStore()
const auth        = useAuthStore()
const router      = useRouter()
const settings    = useAppSettingsStore()
const currentUser = auth.user || { email: '' }

const search          = ref('')
const filterRole      = ref('')
const showAdd         = ref(false)
const showLogoutModal = ref(false)

const newUser = ref({ name: '', email: '', password: '', role: 'viewer', profilePicture: '' })

const roleOptions = [
  { value: '',       label: 'All'    },
  { value: 'viewer', label: 'Viewer' },
  { value: 'seller', label: 'Seller' },
  { value: 'admin',  label: 'Admin'  },
]

// ── Computed ─────────────────────────────────────────────────────
const filteredUsers = computed(() =>
  users.users.filter(u => {
    if (filterRole.value && u.role !== filterRole.value) return false
    const q = search.value.trim().toLowerCase()
    if (!q) return true
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })
)

const sellerCount  = computed(() => users.users.filter(u => u.role === 'seller').length)
const viewerCount  = computed(() => users.users.filter(u => u.role === 'viewer').length)
const adminCount   = computed(() => users.users.filter(u => u.role === 'admin').length)

const adminInitials = computed(() => {
  const name = auth.user?.name || 'A'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const footerStats = computed(() => [
  { val: users.users.length, label: 'Total Users' },
  { val: sellerCount.value,  label: 'Sellers'      },
  { val: viewerCount.value,  label: 'Viewers'      },
  { val: adminCount.value,   label: 'Admins'       },
])

// ── Actions ──────────────────────────────────────────────────────
function changeRole(user) {
  users.updateUser(user.id, { role: user.role })
}

function remove(user) {
  if (user.email === currentUser.email) return
  if (!window.confirm(`Delete ${user.name} (${user.email})?\nThis cannot be undone.`)) return
  users.removeUser(user.id)
}

function addUser() {
  if (!newUser.value.name || !newUser.value.email || !newUser.value.password) return
  users.addUser({ ...newUser.value, id: Date.now() })
  newUser.value = { name: '', email: '', password: '', role: 'viewer', profilePicture: '' }
  showAdd.value = false
}

function resetPassword(user) {
  const pw = prompt(`Set new password for ${user.email}`, '')
  if (pw !== null && pw.trim() !== '') {
    users.updateUser(user.id, { password: pw })
    alert('Password updated successfully.')
  }
}

function handleAddFile(e) {
  const f = e.target.files?.[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => { newUser.value.profilePicture = reader.result }
  reader.readAsDataURL(f)
}

function onRowFileChange(e, user) {
  const f = e.target.files?.[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => { users.updateUser(user.id, { profilePicture: reader.result }) }
  reader.readAsDataURL(f)
}

function confirmLogout() {
  showLogoutModal.value = false
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
/* ── Shell ────────────────────────────────────────────────── */
.admin-shell {
  min-height: 100vh;
  background: var(--navy);
  display: flex;
  flex-direction: column;
  font-family: var(--font);
}

/* ── Top bar ──────────────────────────────────────────────── */
.topbar {
  height: 60px;
  background: var(--navy-2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 40;
}
.topbar-left  { display: flex; align-items: center; gap: 14px; }
.topbar-logo  { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.topbar-brand { font-size: 18px; font-weight: 700; color: var(--text-main); }
.topbar-brand span { color: var(--gold); }
.topbar-divider { width: 1px; height: 22px; background: var(--border); }
.topbar-section { font-size: 13px; color: var(--text-muted); font-weight: 500; letter-spacing: .5px; }
.topbar-right { display: flex; align-items: center; gap: 14px; }
.topbar-stat  { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.ts-val   { font-size: 18px; font-weight: 700; color: var(--gold); line-height: 1; }
.ts-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .5px; }
.tool-btn {
  background: transparent; color: var(--text-muted);
  border: 1px solid var(--border); padding: 6px 10px;
  border-radius: 7px; font-size: 13px; cursor: pointer;
  font-family: var(--font); transition: all .2s;
}
.tool-btn:hover { color: var(--gold); border-color: var(--gold); }
.admin-badge {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 12px 5px 5px;
  border: 1px solid rgba(201,168,76,0.3); border-radius: 30px;
  background: rgba(201,168,76,0.07); font-size: 12px; color: var(--gold); font-weight: 600;
}
.admin-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--gold); color: var(--navy);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800;
}
.topbar-logout {
  background: transparent; color: var(--text-muted);
  border: 1px solid var(--border); padding: 7px 16px;
  border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: var(--font); transition: all .2s;
}
.topbar-logout:hover { color: #ff6b6b; border-color: rgba(255,107,107,0.5); background: rgba(255,107,107,0.07); }

/* ── Main ────────────────────────────────────────────────── */
.admin-main { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; width: 100%; }

/* ── Panel header ─────────────────────────────────────────── */
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
.panel-title { font-size: 26px; font-weight: 700; color: var(--text-main); margin: 0; }
.panel-sub  { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
.btn-add {
  display: flex; align-items: center; gap: 8px;
  background: var(--gold); color: var(--navy); border: none;
  padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 700;
  font-family: var(--font); cursor: pointer; transition: opacity .2s, transform .15s;
}
.btn-add:hover { opacity: .88; transform: translateY(-1px); }
.btn-add-icon { font-size: 18px; line-height: 1; }

/* ── Add panel ────────────────────────────────────────────── */
.add-panel {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 1.5rem; margin-bottom: 1.75rem;
  border-left: 3px solid var(--gold);
}
.add-panel-title { font-size: 14px; font-weight: 700; color: var(--gold); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: .8px; }
.add-grid { display: grid; grid-template-columns: repeat(4, 1fr) 1.2fr; gap: 12px; align-items: end; }
.add-field { display: flex; flex-direction: column; gap: 5px; }
.add-field label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.field-input { background: var(--navy); border: 1px solid var(--border); border-radius: 7px; padding: 9px 11px; color: var(--text-main); font-family: var(--font); font-size: 13px; outline: none; width: 100%; }
.field-input:focus { border-color: var(--gold); }
.field-select { appearance: none; cursor: pointer; }
.upload-row { display: flex; align-items: center; gap: 8px; }
.mini-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #c9a84c, #9d8b3f); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; overflow: hidden; flex-shrink: 0; border: 2px solid var(--gold); }
.mini-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.btn-upload { display: inline-block; background: rgba(201,168,76,0.12); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-upload:hover { background: rgba(201,168,76,0.25); }
.hidden-input { display: none; }
.add-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.25rem; }
.btn-cancel-add { background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 9px 20px; border-radius: 7px; font-family: var(--font); font-size: 13px; cursor: pointer; }
.btn-cancel-add:hover { border-color: var(--gold); color: var(--text-main); }
.btn-create { background: var(--gold); color: var(--navy); border: none; padding: 9px 24px; border-radius: 7px; font-family: var(--font); font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.btn-create:hover { opacity: .85; }

.slide-down-enter-active { transition: all .3s cubic-bezier(.4,0,.2,1); }
.slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from  { opacity: 0; transform: translateY(-12px); }
.slide-down-leave-to    { opacity: 0; transform: translateY(-8px); }

/* ── Filters ─────────────────────────────────────────────── */
.filters-row { display: flex; align-items: center; gap: 16px; margin-bottom: 1.25rem; flex-wrap: wrap; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 0 12px; flex: 1; min-width: 220px; }
.search-icon { font-size: 14px; }
.search-input { background: transparent; border: none; outline: none; color: var(--text-main); font-family: var(--font); font-size: 13px; padding: 10px 0; width: 100%; }
.search-input::placeholder { color: var(--text-muted); }
.role-pills { display: flex; gap: 6px; }
.role-pill { padding: 7px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-family: var(--font); transition: all .2s; }
.role-pill:hover { border-color: var(--gold); color: var(--gold); }
.role-pill.active { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.5); color: var(--gold); }

/* ── Table ───────────────────────────────────────────────── */
.table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.user-table { width: 100%; border-collapse: collapse; }
.user-table thead tr { background: rgba(201,168,76,0.06); border-bottom: 1px solid var(--border); }
.user-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .8px; }
.col-actions { width: 130px; text-align: center; }
.user-row { border-bottom: 1px solid var(--border); transition: background .15s; animation: fadeIn .35s ease both; animation-delay: var(--delay); }
.user-row:last-child { border-bottom: none; }
.user-row:hover { background: rgba(201,168,76,0.04); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.user-table td { padding: 12px 16px; vertical-align: middle; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.row-avatar { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; overflow: hidden; flex-shrink: 0; }
.row-avatar.role-seller { background: rgba(201,168,76,0.2); color: var(--gold); border: 1px solid rgba(201,168,76,0.4); }
.row-avatar.role-viewer { background: rgba(111,186,255,0.15); color: #6fbaff; border: 1px solid rgba(111,186,255,0.3); }
.row-avatar.role-admin  { background: rgba(167,139,250,0.15); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); }
.row-avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.user-name { display: block; font-size: 14px; font-weight: 600; color: var(--text-main); }
.user-id   { display: block; font-size: 11px; color: var(--text-muted); margin-top: 1px; }
.email-cell { font-size: 13px; color: var(--text-muted); }
.role-select { appearance: none; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: var(--font); cursor: pointer; border: 1px solid; outline: none; transition: all .2s; }
.rs-seller { background: rgba(201,168,76,0.12); color: var(--gold); border-color: rgba(201,168,76,0.35); }
.rs-viewer { background: rgba(111,186,255,0.1);  color: #6fbaff;    border-color: rgba(111,186,255,0.3); }
.rs-admin  { background: rgba(167,139,250,0.12); color: #a78bfa;    border-color: rgba(167,139,250,0.35); }
.rs-seller option, .rs-viewer option, .rs-admin option { background: var(--navy-2); color: var(--text-main); }
.status-dot { font-size: 12px; font-weight: 600; }
.active-dot { color: #51cf66; }
.actions-cell { display: flex; align-items: center; gap: 6px; justify-content: center; }
.action-btn { width: 32px; height: 32px; border-radius: 7px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all .2s; font-family: var(--font); }
.action-btn:hover { border-color: var(--gold); background: rgba(201,168,76,0.1); }
.photo-btn { position: relative; overflow: hidden; }
.pw-btn:hover  { border-color: #4dabf7; background: rgba(77,171,247,0.1); }
.del-btn:hover { border-color: #ff6b6b; background: rgba(255,107,107,0.1); color: #ff6b6b; }
.del-btn.disabled { opacity: .35; cursor: not-allowed; pointer-events: none; }
.empty-row { padding: 0 !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 3rem; color: var(--text-muted); }
.empty-icon { font-size: 40px; margin-bottom: .75rem; }
.empty-state p { font-size: 14px; }

/* ── Footer stats ────────────────────────────────────────── */
.footer-stats { display: flex; gap: 0; margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.fs-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 1.1rem; border-right: 1px solid var(--border); gap: 4px; }
.fs-item:last-child { border-right: none; }
.fs-val   { font-size: 24px; font-weight: 700; color: var(--gold); }
.fs-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .6px; }

/* ── Logout Modal ────────────────────────────────────────── */
.logout-backdrop {
  position: fixed; inset: 0;
  background: rgba(5,12,25,0.72);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; padding: 1rem;
}
.logout-modal {
  background: var(--navy-2);
  border: 1px solid var(--border);
  border-radius: 18px; padding: 2rem 2rem 1.75rem;
  width: 100%; max-width: 400px; text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.08);
}
.lm-icon { margin-bottom: 1.25rem; display: flex; justify-content: center; }
.lm-title { font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: .5rem; }
.lm-sub { font-size: 13px; color: var(--text-muted); line-height: 1.65; margin-bottom: 1.25rem; }
.lm-sub strong { color: var(--text-main); }
.lm-user-chip { display: flex; align-items: center; gap: 10px; background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.18); border-radius: 10px; padding: 10px 14px; margin-bottom: 1.5rem; text-align: left; }
.lm-chip-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--gold); color: var(--navy); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
.lm-chip-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.lm-chip-name  { font-size: 13px; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lm-chip-email { font-size: 11px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lm-chip-role { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; text-transform: capitalize; flex-shrink: 0; }
.lm-chip-role.admin { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); }
.lm-actions { display: flex; gap: 10px; }
.lm-btn-cancel { flex: 1; padding: 11px; background: transparent; border: 1px solid var(--border); border-radius: 9px; color: var(--text-muted); font-family: var(--font); font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; }
.lm-btn-cancel:hover { border-color: var(--gold); color: var(--text-main); }
.lm-btn-confirm { flex: 1; padding: 11px; background: rgba(255,107,107,0.12); border: 1px solid rgba(255,107,107,0.35); border-radius: 9px; color: #ff6b6b; font-family: var(--font); font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s; }
.lm-btn-confirm:hover { background: rgba(255,107,107,0.22); border-color: #ff6b6b; }
.modal-fade-enter-active { transition: all .22s cubic-bezier(.4,0,.2,1); }
.modal-fade-leave-active { transition: all .18s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .topbar-right .topbar-stat { display: none; }
  .add-grid { grid-template-columns: 1fr 1fr; }
  .admin-main { padding: 1.5rem 1rem; }
  .filters-row { flex-direction: column; align-items: stretch; }
}
</style>