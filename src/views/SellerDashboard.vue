<template>
  <div class="seller-dashboard-wrapper">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="avatar-circle">
          <img v-if="sellerProfilePicture" :src="sellerProfilePicture" alt="Seller profile" class="avatar-img" />
          <span v-else>{{ initials }}</span>
        </div>
        <h3 class="dashboard-title">{{ auth.user?.name }}</h3>
        <p class="dashboard-subtitle">Seller Dashboard</p>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in menuItems" :key="item.id"
          class="nav-item"
          :class="{ active: activeTab === item.id }"
          @click="activeTab = item.id"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge > 0" class="badge">{{ item.badge }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-logout" @click="logout">🚪 Logout</button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="dashboard-content">

      <!-- ==================== HOME TAB ==================== -->
      <section v-if="activeTab === 'home'" class="content-section">
        <div class="section-header">
          <div>
            <h1>Welcome back, {{ auth.user?.name }}!</h1>
            <p>Here's your selling overview</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <div class="stat-label">Active Listings</div>
              <div class="stat-value">{{ activeListings.length }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👁️</div>
            <div class="stat-info">
              <div class="stat-label">Total Views</div>
              <div class="stat-value">{{ totalViews.toLocaleString() }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <div class="stat-label">Enquiries</div>
              <div class="stat-value">{{ enquiriesStore.enquiries.length }}</div>
              <div class="stat-sub">{{ unread }} unread</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-label">Sold / Rented</div>
              <div class="stat-value">{{ soldCount }}</div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <button class="action-btn" @click="openAddModal">📝 Add New Listing</button>
            <button class="action-btn" @click="activeTab = 'overview'">OV Buy Page Overview</button>
            <button class="action-btn" @click="activeTab = 'bookings'">📅 View Bookings</button>
            <button class="action-btn" @click="activeTab = 'notifications'">🔔 Check Notifications</button>
            <button class="action-btn" @click="activeTab = 'settings'">⚙️ Settings</button>
          </div>
        </div>

        <div class="insights-grid">
          <div class="insight-card">
            <span>Most viewed</span>
            <strong>{{ mostViewed?.title || 'No listings yet' }}</strong>
            <small>{{ mostViewed ? `${mostViewed.views} views` : 'Add a listing to start tracking' }}</small>
          </div>
          <div class="insight-card">
            <span>Top category</span>
            <strong>{{ topCategory }}</strong>
            <small>Based on your current listings</small>
          </div>
          <div class="insight-card">
            <span>Buy page listings</span>
            <strong>{{ forSale.length }}</strong>
            <small>Visible to buyers right now</small>
          </div>
        </div>

        <div class="recent-section" v-if="enquiriesStore.enquiries.length > 0">
          <h3>Recent Enquiries</h3>
          <div class="recent-list">
            <div v-for="e in enquiriesStore.enquiries.slice(0,3)" :key="e.id"
              class="recent-item" :class="{ unread: !e.read }">
              <div class="recent-icon">{{ e.read ? '📨' : '🔔' }}</div>
              <div class="recent-info">
                <div class="recent-name">{{ e.fromName }}</div>
                <div class="recent-prop">Re: {{ e.propertyTitle }}</div>
              </div>
              <div class="recent-time">{{ e.createdAt }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== OVERVIEW TAB ==================== -->
      <section v-if="activeTab === 'overview'" class="content-section">
        <div class="section-header">
          <div>
            <h2>Overview</h2>
            <p>{{ forSale.length }} properties currently visible on the Buy page</p>
          </div>
          <button class="btn-outline" @click="router.push('/property/buy')">Open Buy Page</button>
        </div>

        <div v-if="forSale.length === 0" class="empty-state">
          <div style="font-size:48px;margin-bottom:1rem;">-</div>
          <h3>No buy listings available</h3>
          <p>When properties are published for sale, they will appear here.</p>
        </div>

        <div v-else class="properties-grid">
          <div v-for="p in forSale" :key="'overview-' + p.id" class="property-card">
            <div class="property-image">
              <img :src="p.image" :alt="p.title" />
              <span class="property-badge sell">For Sale</span>
              <span class="prop-status-badge" :class="p.status">{{ p.status }}</span>
              <span class="cat-pill">{{ categoryIcon(p.category) }} {{ p.category }}</span>
            </div>
            <div class="property-info">
              <h3>{{ p.title }}</h3>
              <p class="property-type">{{ p.type }} &bull; {{ p.location }}</p>
              <p class="overview-seller">Listed by: {{ getSellerName(p.sellerId) }}</p>
              <div v-if="auth.user?.id === p.sellerId" class="overview-own-listing">Your listing</div>
              <div class="property-details">
                <span v-if="p.category === 'house'">{{ p.bedrooms }} beds</span>
                <span v-if="p.category === 'house'">{{ p.bathrooms }} baths</span>
                <span>{{ p.views }} views</span>
              </div>
              <div class="property-footer">
                <p class="price">{{ formatRWF(p.price) }}</p>
                <button class="btn-edit" @click="listingsStore.incrementViews(p.id)">View</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SELLS TAB ==================== -->
      <section v-if="activeTab === 'sells'" class="content-section">
        <div class="section-header">
          <h2>My Listings</h2>
          <button class="btn-primary" @click="openAddModal">+ Add Listing</button>
        </div>

        <div v-if="sellerListings.length === 0" class="empty-state">
          <div style="font-size:48px;margin-bottom:1rem;">📭</div>
          <h3>No listings yet</h3>
          <p>Start by adding your first house, land, or car.</p>
          <button class="btn-primary" style="margin-top:1rem;" @click="openAddModal">Add Your First Listing</button>
        </div>

        <div v-else class="properties-grid">
          <div v-for="p in sellerListings" :key="p.id" class="property-card">
            <div class="property-image">
              <img :src="p.image" :alt="p.title" />
              <span class="property-badge" :class="p.mode">
                {{ p.mode === 'sell' ? 'For Sale' : 'For Rent' }}
              </span>
              <span class="prop-status-badge" :class="p.status">{{ p.status }}</span>
              <span class="cat-pill">{{ categoryIcon(p.category) }} {{ p.category }}</span>
            </div>
            <div class="property-info">
              <h3>{{ p.title }}</h3>
              <p class="property-type">{{ p.type }} • {{ p.location }}</p>
              <div class="property-details">
                <span v-if="p.category === 'house'">🛏️ {{ p.bedrooms }} beds</span>
                <span v-if="p.category === 'house'">🚿 {{ p.bathrooms }} baths</span>
                <span>👁️ {{ p.views }} views</span>
              </div>
              <div class="property-footer">
                <p class="price">{{ formatPrice(p) }}</p>
                <div style="display:flex;gap:8px;">
                  <button class="btn-edit"   @click="editListing(p)">Edit</button>
                  <button class="btn-remove" @click="listingsStore.removeListing(p.id)">Remove</button>
                </div>
              </div>
              <div class="status-actions">
                <button class="btn-status" @click="setListingStatus(p, 'active')">Active</button>
                <button class="btn-status" @click="setListingStatus(p, p.mode === 'rent' ? 'rented' : 'sold')">
                  {{ p.mode === 'rent' ? 'Rented' : 'Sold' }}
                </button>
                <button class="btn-status" @click="setListingStatus(p, 'pending')">Pause</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== BOOKINGS TAB ==================== -->
      <section v-if="activeTab === 'bookings'" class="content-section">
        <div class="section-header">
          <h2>Enquiries &amp; Bookings</h2>
          <button class="btn-outline" @click="markAllRead">Mark all read</button>
        </div>

        <div v-if="enquiriesStore.enquiries.length === 0" class="empty-state">
          <div style="font-size:48px;margin-bottom:1rem;">📭</div>
          <h3>No enquiries yet</h3>
          <p>When buyers enquire about your listings, they will appear here.</p>
        </div>

        <div v-else class="enquiries-list">
          <div
            v-for="enquiry in enquiriesStore.enquiries" :key="enquiry.id"
            class="enquiry-card" :class="{ unread: !enquiry.read }"
          >
            <div class="enquiry-header">
              <div style="display:flex;align-items:center;gap:10px;">
                <span v-if="!enquiry.read" style="color:var(--gold);font-size:18px;">🔔</span>
                <h3>{{ enquiry.fromName }}</h3>
              </div>
              <span class="enquiry-date">{{ enquiry.createdAt }}</span>
            </div>
            <p class="enquiry-email">📧 {{ enquiry.fromEmail }}</p>
            <div class="enquiry-subject"><strong>Re:</strong> {{ enquiry.propertyTitle }}</div>
            <p class="enquiry-message">{{ enquiry.message }}</p>
            <div class="enquiry-actions">
              <button class="btn-reply" @click="enquiriesStore.markRead(enquiry.id)">
                {{ enquiry.read ? '✅ Replied' : '↩️ Reply' }}
              </button>
              <button v-if="!enquiry.read" class="btn-mark-read"
                @click="enquiriesStore.markRead(enquiry.id)">Mark as Read</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== NOTIFICATIONS TAB ==================== -->
      <section v-if="activeTab === 'notifications'" class="content-section">
        <div class="section-header"><h2>Notifications</h2></div>

        <div class="notifications-list">
          <div
            v-for="e in enquiriesStore.enquiries" :key="'notif-' + e.id"
            class="notification-item" :class="{ new: !e.read }"
          >
            <span class="notif-icon">{{ e.read ? '📨' : '🔔' }}</span>
            <div class="notif-content">
              <p><strong>New enquiry from {{ e.fromName }}</strong> about "{{ e.propertyTitle }}"</p>
              <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">"{{ e.message.slice(0, 80) }}..."</p>
              <span class="notif-time">{{ e.createdAt }}</span>
            </div>
            <span v-if="!e.read" class="new-dot">New</span>
          </div>
          <div class="notification-item">
            <span class="notif-icon">👁️</span>
            <div class="notif-content">
              <p><strong>Your listings have been viewed {{ totalViews }} times</strong></p>
              <span class="notif-time">Overall stats</span>
            </div>
          </div>
          <div class="notification-item">
            <span class="notif-icon">✅</span>
            <div class="notif-content">
              <p><strong>{{ soldCount }} items sold/rented</strong> from your listings</p>
              <span class="notif-time">All time</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== SETTINGS TAB ==================== -->
      <section v-if="activeTab === 'settings'" class="content-section">
        <div class="section-header"><h2>Settings</h2></div>

        <div class="settings-container">
          <div class="settings-section">
            <h3>Buyer Profile Preview</h3>
            <div class="profile-preview-card">
              <div class="avatar-circle">
                <img v-if="sellerProfilePicture" :src="sellerProfilePicture" alt="Seller profile" class="avatar-img" />
                <span v-else>{{ initials }}</span>
              </div>
              <div>
                <strong>{{ settingsForm.name || auth.user?.name }}</strong>
                <p>{{ settingsForm.bio || 'Add a short bio so buyers know who they are contacting.' }}</p>
                <small>{{ settingsForm.phone || 'No phone added' }} • {{ settingsForm.email }}</small>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Profile Settings</h3>
            <div class="settings-form">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="settingsForm.name" type="text" placeholder="Your full name" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="settingsForm.email" type="email" placeholder="your@email.com" />
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input v-model="settingsForm.phone" type="tel" placeholder="+250 700 000 000" />
              </div>
              <div class="form-group">
                <label>Bio</label>
                <textarea v-model="settingsForm.bio" rows="4" placeholder="Tell buyers about your business..."></textarea>
              </div>
              <button class="btn-primary" @click="saveSettings">Save Changes</button>
            </div>
          </div>

          <div class="settings-section">
            <h3>Account Settings</h3>
            <div class="settings-form">
              <div class="form-group"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
              <div class="form-group"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
              <div class="form-group"><label>Confirm Password</label><input type="password" placeholder="••••••••" /></div>
              <button class="btn-outline">Update Password</button>
            </div>
          </div>

          <div class="settings-section">
            <h3>Notification Preferences</h3>
            <div class="settings-toggles">
              <div class="toggle-item" v-for="pref in notifPrefs" :key="pref.label">
                <div class="toggle-label">
                  <strong>{{ pref.label }}</strong>
                  <p>{{ pref.desc }}</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" v-model="pref.enabled" />
                  <span class="toggle-switch"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- ==================== ADD / EDIT LISTING MODAL ==================== -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingId ? 'Edit Listing' : 'Add New Listing' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <!-- Category Selector -->
        <div class="form-group">
          <label>Category</label>
          <div class="cat-select-row">
            <button
              v-for="cat in categories" :key="cat.value"
              class="cat-select-btn"
              :class="{ active: form.category === cat.value }"
              @click="form.category = cat.value; form.type = typesByCategory[cat.value][0]"
            >{{ cat.icon }} {{ cat.label }}</button>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" class="form-input" :placeholder="titlePlaceholder" />
          </div>
          <div class="form-group">
            <label>Type</label>
            <select v-model="form.type" class="form-input">
              <option v-for="t in typesByCategory[form.category]" :key="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <!-- ✅ label updated to RWF -->
            <label>Price (RWF)</label>
            <input v-model="form.price" type="number" class="form-input" placeholder="e.g. 50000" />
          </div>
          <div class="form-group">
            <label>Buyer Action</label>
            <select v-model="form.mode" class="form-input">
              <option value="sell">Buy / For Sale</option>
              <option value="rent">{{ form.category === 'car' ? 'For Hire (per day)' : 'For Rent (per month)' }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Price Range</label>
          <select v-model="form.priceRange" class="form-input">
            <option value="">Choose a price range</option>
            <option v-for="range in priceRanges" :key="range.value" :value="range.value">{{ range.label }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Location</label>
          <select v-model="form.location" class="form-input">
            <option value="">Choose location</option>
            <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
          </select>
        </div>

        <div v-if="form.category === 'house'" class="form-row">
          <div class="form-group">
            <label>Bedrooms</label>
            <input v-model="form.bedrooms" type="number" class="form-input" placeholder="3" />
          </div>
          <div class="form-group">
            <label>Bathrooms</label>
            <input v-model="form.bathrooms" type="number" class="form-input" placeholder="2" />
          </div>
        </div>

        <div class="form-group">
          <label>Image URL</label>
          <input v-model="form.image" class="form-input" placeholder="https://images.unsplash.com/..." />
          <input type="file" accept="image/*" class="form-input" style="margin-top:6px;" @change="handleImageFile" />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" class="form-input" rows="3" placeholder="Describe this listing..."></textarea>
        </div>

        <div class="modal-footer">
          <button class="btn-outline" @click="closeModal">Cancel</button>
          <button class="btn-primary" @click="submitForm">
            {{ editingId ? 'Save Changes' : 'Publish Listing' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter }         from 'vue-router'
import { useAuthStore }      from '@/stores/auth'
import { useListingsStore }  from '@/stores/listings'
import { formatRWF }         from '@/stores/listings'
import { useEnquiriesStore } from '@/stores/enquiries'
import { useUsersStore }     from '@/stores/users'

const router         = useRouter()
const auth           = useAuthStore()
const listingsStore  = useListingsStore()
const enquiriesStore = useEnquiriesStore()
const usersStore     = useUsersStore()

const activeTab = ref('home')
const showModal = ref(false)
const editingId = ref(null)

const settingsForm = ref({
  name:  auth.user?.name  || '',
  email: auth.user?.email || '',
  phone: '',
  bio:   '',
})

const notifPrefs = reactive([
  { label: 'Email Notifications', desc: 'Receive emails for new enquiries',    enabled: true },
  { label: 'SMS Alerts',           desc: 'Receive SMS for urgent messages',     enabled: true },
  { label: 'Weekly Reports',       desc: 'Receive weekly performance reports',  enabled: true },
])

const unread = computed(() => enquiriesStore.enquiries.filter(e => !e.read).length)

const menuItems = computed(() => [
  { id: 'home',          label: 'Home',          icon: '🏠', badge: 0 },
  { id: 'overview',      label: 'Overview',      icon: 'OV', badge: 0 },
  { id: 'sells',         label: 'Sells',         icon: '📝', badge: 0 },
  { id: 'bookings',      label: 'Bookings',      icon: '📅', badge: unread.value },
  { id: 'notifications', label: 'Notifications', icon: '🔔', badge: unread.value },
  { id: 'settings',      label: 'Settings',      icon: '⚙️', badge: 0 },
])

const initials = computed(() => {
  const name = auth.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const sellerId       = computed(() => auth.user?.id || 1)
const currentSeller  = computed(() => usersStore.findById(sellerId.value))
const sellerProfilePicture = computed(() => currentSeller.value?.profilePicture || auth.user?.profilePicture || '')
const forSale        = computed(() => listingsStore.properties.filter(p => p.mode === 'sell'))
const sellerListings = computed(() =>
  listingsStore.properties.filter(p => p.sellerId === sellerId.value || (p.category === 'car' && p.sellerId === 1))
)
const activeListings = computed(() => sellerListings.value.filter(p => p.status === 'active'))
const soldCount      = computed(() => sellerListings.value.filter(p => ['sold','rented'].includes(p.status)).length)
const totalViews     = computed(() => sellerListings.value.reduce((sum, p) => sum + (p.views || 0), 0))
const mostViewed     = computed(() => [...sellerListings.value].sort((a,b) => b.views - a.views)[0])
const topCategory    = computed(() => {
  if (!sellerListings.value.length) return 'No listings yet'
  const counts = sellerListings.value.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1; return acc
  }, {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
})

const locations = [
  'Kacyiru, Kigali','Nyarutarama, Kigali','Kimihurura, Kigali',
  'Remera, Kigali','Gisozi, Kigali','Kicukiro, Kigali',
  'Rebero, Kigali','Bugesera, Eastern Province','Kigali',
]

// ✅ Price ranges updated to RWF labels
const priceRanges = [
  { value: '0-1000',           label: 'Under RWF 1,000'          },
  { value: '1000-50000',       label: 'RWF 1,000 – 50,000'       },
  { value: '50000-100000',     label: 'RWF 50,000 – 100,000'     },
  { value: '100000-999999999', label: 'RWF 100,000+'             },
]

const categories = [
  { value: 'house', label: 'House', icon: '🏠' },
  { value: 'land',  label: 'Land',  icon: '🌍' },
  { value: 'car',   label: 'Car',   icon: '🚗' },
]

const typesByCategory = {
  house: ['House','Apartment','Villa','Studio','Townhouse'],
  land:  ['Residential Land','Commercial Land','Agricultural Land'],
  car:   ['SUV','Sedan','Van','Pickup','Bus','Minibus'],
}

const blankForm = () => ({
  title: '', category: 'house', type: 'House', price: '',
  priceRange: '', mode: 'sell', location: '', bedrooms: '', bathrooms: '',
  image: '', description: '',
})
const form = reactive(blankForm())

const titlePlaceholder = computed(() => ({
  house: 'e.g. Kacyiru 3-bed Villa',
  land:  'e.g. Rebero 10-acre Plot',
  car:   'e.g. Toyota Land Cruiser 2020',
}[form.category]))

function categoryIcon(cat) {
  return { house: '🏠', land: '🌍', car: '🚗' }[cat] || '📦'
}

/** Format price for the Sells tab card footer */
function formatPrice(p) {
  if (p.mode === 'rent') {
    const suffix = p.category === 'car' ? '/day' : '/mo'
    return formatRWF(p.price, { suffix })
  }
  return formatRWF(p.price)
}

function getSellerName(sid) {
  const seller = usersStore.findById(sid)
  return seller ? seller.name : 'Seller'
}

function setListingStatus(listing, status) {
  listingsStore.updateListing(listing.id, { status })
}

function handleImageFile(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { form.image = reader.result }
  reader.readAsDataURL(file)
}

function openAddModal() {
  editingId.value = null
  Object.assign(form, blankForm())
  showModal.value = true
}

function editListing(p) {
  editingId.value = p.id
  Object.assign(form, { ...p })
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  Object.assign(form, blankForm())
}

function submitForm() {
  const payload = {
    ...form,
    price:     Number(form.price),
    bedrooms:  form.category === 'house' ? Number(form.bedrooms)  : null,
    bathrooms: form.category === 'house' ? Number(form.bathrooms) : null,
    sellerId:  sellerId.value,
  }
  if (editingId.value) {
    listingsStore.updateListing(editingId.value, payload)
  } else {
    listingsStore.addListing(payload)
  }
  closeModal()
  activeTab.value = 'sells'
}

function markAllRead() {
  enquiriesStore.enquiries.forEach(e => e.read = true)
}

function saveSettings() {
  alert('Settings saved successfully!')
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.seller-dashboard-wrapper { display: flex; min-height: 100vh; background: var(--navy); }
.sidebar { width: 260px; background: linear-gradient(180deg, var(--navy-2) 0%, var(--navy-3) 100%); border-right: 1px solid var(--border); padding: 1.5rem 0; position: fixed; height: 100vh; overflow-y: auto; left: 0; top: 0; display: flex; flex-direction: column; }
.sidebar-header { padding: 0 1.5rem 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; text-align: center; }
.avatar-circle { width: 52px; height: 52px; border-radius: 50%; background: var(--gold); color: var(--navy); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; margin: 0 auto 10px; overflow: hidden; border: 2px solid rgba(201,168,76,0.65); }
.avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.dashboard-title { color: var(--text-main); font-size: 15px; font-weight: 700; margin-bottom: 2px; }
.dashboard-subtitle { color: var(--text-muted); font-size: 12px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 1rem; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; border-radius: 8px; transition: all .2s; font-family: var(--font); font-size: 14px; font-weight: 500; }
.nav-item:hover { background: rgba(201,168,76,0.1); color: var(--gold); }
.nav-item.active { background: rgba(201,168,76,0.18); color: var(--gold); border-left: 3px solid var(--gold); padding-left: 11px; }
.nav-icon { font-size: 18px; min-width: 22px; }
.nav-label { flex: 1; text-align: left; }
.badge { background: #ff6b6b; color: white; border-radius: 50%; min-width: 20px; height: 20px; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.sidebar-footer { padding: 1rem; border-top: 1px solid var(--border); margin-top: auto; }
.btn-logout { width: 100%; padding: 10px; background: rgba(255,107,107,0.15); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.4); border-radius: 7px; font-family: var(--font); font-weight: 600; cursor: pointer; transition: all .2s; }
.btn-logout:hover { background: rgba(255,107,107,0.25); }
.dashboard-content { flex: 1; margin-left: 260px; padding: 2rem; overflow-y: auto; }
.content-section { max-width: 1100px; margin: 0 auto; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.section-header h1 { font-size: 26px; font-weight: 700; }
.section-header h2 { font-size: 22px; font-weight: 700; }
.section-header p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 2rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; display: flex; gap: 14px; align-items: center; }
.stat-icon { font-size: 28px; }
.stat-label { color: var(--text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
.stat-value { font-size: 26px; font-weight: 700; color: var(--gold); }
.stat-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.quick-actions { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; margin-bottom: 2rem; }
.quick-actions h3 { margin-bottom: 1rem; font-size: 15px; color: var(--text-muted); }
.actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }
.action-btn { padding: 12px; background: rgba(201,168,76,0.08); border: 1px solid var(--border); border-radius: 8px; color: var(--text-main); cursor: pointer; font-family: var(--font); font-size: 13px; font-weight: 500; transition: all .2s; text-align: center; }
.action-btn:hover { background: rgba(201,168,76,0.18); border-color: var(--gold); color: var(--gold); }
.insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 2rem; }
.insight-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 6px; }
.insight-card span { color: var(--text-muted); font-size: 12px; text-transform: uppercase; }
.insight-card strong { color: var(--text-main); font-size: 16px; }
.insight-card small { color: var(--text-muted); font-size: 12px; }
.recent-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.recent-section h3 { font-size: 15px; color: var(--text-muted); margin-bottom: 1rem; }
.recent-list { display: flex; flex-direction: column; gap: 10px; }
.recent-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; background: var(--navy); border: 1px solid var(--border); }
.recent-item.unread { border-color: rgba(201,168,76,0.35); }
.recent-icon { font-size: 20px; }
.recent-name { font-weight: 500; font-size: 14px; }
.recent-prop { font-size: 12px; color: var(--text-muted); }
.recent-time { font-size: 12px; color: var(--text-muted); margin-left: auto; }
.properties-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.property-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all .2s; }
.property-card:hover { border-color: var(--gold); transform: translateY(-3px); }
.property-image { position: relative; height: 190px; overflow: hidden; }
.property-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.property-badge { position: absolute; top: 10px; left: 10px; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: var(--gold); color: var(--navy); text-transform: uppercase; }
.property-badge.rent { background: #4dabf7; color: var(--navy); }
.prop-status-badge { position: absolute; top: 10px; right: 10px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; text-transform: capitalize; }
.prop-status-badge.active  { background: rgba(81,207,102,0.2);  color: #51cf66; border: 1px solid #51cf66; }
.prop-status-badge.pending { background: rgba(255,169,77,0.2);  color: #ffa94d; border: 1px solid #ffa94d; }
.prop-status-badge.sold    { background: rgba(167,139,250,0.2); color: #a78bfa; border: 1px solid #a78bfa; }
.prop-status-badge.rented  { background: rgba(127,224,176,0.2); color: #7fe0b0; border: 1px solid #7fe0b0; }
.cat-pill { position: absolute; bottom: 10px; left: 10px; background: rgba(10,22,40,0.75); color: var(--text-main); font-size: 11px; padding: 3px 9px; border-radius: 20px; text-transform: capitalize; }
.property-info { padding: 1rem; }
.property-info h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.property-type { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
.overview-seller { font-size: 12px; color: #d8d8ff; margin-bottom: 8px; }
.overview-own-listing { display: inline-block; margin-bottom: 8px; background: rgba(111,186,255,0.12); color: #6fbaff; border: 1px solid rgba(111,186,255,0.25); border-radius: 16px; padding: 3px 9px; font-size: 11px; font-weight: 600; }
.property-details { display: flex; gap: 12px; font-size: 12px; color: var(--text-muted); padding-bottom: 10px; border-bottom: 1px solid var(--border); margin-bottom: 10px; min-height: 20px; }
.property-footer { display: flex; justify-content: space-between; align-items: center; }
.price { font-size: 14px; font-weight: 700; color: var(--gold); }
.status-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
.btn-status { padding: 7px 8px; background: rgba(201,168,76,0.08); border: 1px solid var(--border); color: var(--text-muted); border-radius: 6px; cursor: pointer; font-family: var(--font); font-size: 12px; transition: all .2s; }
.btn-status:hover { color: var(--gold); border-color: var(--gold); }
.btn-edit { padding: 5px 12px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); border-radius: 5px; cursor: pointer; font-family: var(--font); font-size: 12px; transition: all .2s; }
.btn-edit:hover { background: var(--gold); color: var(--navy); border-color: var(--gold); }
.btn-remove { padding: 5px 12px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); border-radius: 5px; cursor: pointer; font-family: var(--font); font-size: 12px; transition: all .2s; }
.btn-remove:hover { background: #ff6b6b; color: white; border-color: #ff6b6b; }
.enquiries-list { display: flex; flex-direction: column; gap: 14px; }
.enquiry-card { background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius); padding: 1.5rem; transition: all .2s; }
.enquiry-card.unread { border-color: var(--gold); background: rgba(201,168,76,0.04); }
.enquiry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.enquiry-header h3 { font-size: 15px; font-weight: 600; }
.enquiry-date { font-size: 12px; color: var(--text-muted); }
.enquiry-email { color: var(--text-muted); font-size: 13px; margin-bottom: 8px; }
.enquiry-subject { background: rgba(201,168,76,0.08); padding: 8px 12px; border-radius: 6px; font-size: 13px; margin: 10px 0; }
.enquiry-message { color: var(--text-muted); font-size: 13px; line-height: 1.6; padding: 10px 14px; background: rgba(10,22,40,0.4); border-left: 3px solid var(--gold); border-radius: 4px; margin: 10px 0; }
.enquiry-actions { display: flex; gap: 10px; margin-top: 12px; }
.btn-reply { flex: 1; padding: 9px; background: var(--gold); color: var(--navy); border: none; border-radius: 6px; cursor: pointer; font-family: var(--font); font-weight: 600; transition: opacity .2s; }
.btn-reply:hover { opacity: .85; }
.btn-mark-read { flex: 1; padding: 9px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); border-radius: 6px; cursor: pointer; font-family: var(--font); font-weight: 600; transition: all .2s; }
.btn-mark-read:hover { background: var(--gold); color: var(--navy); border-color: var(--gold); }
.notifications-list { display: flex; flex-direction: column; gap: 10px; }
.notification-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; display: flex; gap: 14px; align-items: flex-start; transition: all .2s; position: relative; }
.notification-item:hover { border-color: rgba(201,168,76,0.3); }
.notification-item.new { border-color: rgba(201,168,76,0.5); background: rgba(201,168,76,0.04); }
.notif-icon { font-size: 24px; min-width: 32px; }
.notif-content { flex: 1; }
.notif-content p { color: var(--text-main); font-size: 14px; }
.notif-time { color: var(--text-muted); font-size: 12px; margin-top: 4px; display: block; }
.new-dot { background: var(--gold); color: var(--navy); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; position: absolute; top: 12px; right: 12px; }
.settings-container { display: flex; flex-direction: column; gap: 1.5rem; }
.settings-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.75rem; }
.settings-section h3 { color: var(--gold); font-size: 15px; font-weight: 700; margin-bottom: 1.25rem; }
.profile-preview-card { display: flex; align-items: center; gap: 14px; background: rgba(201,168,76,0.05); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; }
.profile-preview-card p { color: var(--text-muted); font-size: 13px; margin: 4px 0; }
.profile-preview-card small { color: var(--text-muted); font-size: 12px; }
.settings-form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { color: var(--text-main); font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.form-group input, .form-group textarea { background: var(--navy); border: 1px solid var(--border); border-radius: 7px; padding: 9px 12px; color: var(--text-main); font-family: var(--font); font-size: 13px; outline: none; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--gold); }
.settings-toggles { display: flex; flex-direction: column; gap: 12px; }
.toggle-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(201,168,76,0.04); border-radius: 7px; border: 1px solid var(--border); }
.toggle-label strong { color: var(--text-main); font-size: 13px; display: block; margin-bottom: 2px; }
.toggle-label p { color: var(--text-muted); font-size: 12px; }
.toggle { display: flex; align-items: center; cursor: pointer; }
.toggle input { display: none; }
.toggle-switch { width: 46px; height: 26px; background: var(--border); border-radius: 13px; position: relative; transition: background .2s; }
.toggle-switch::after { content: ''; position: absolute; width: 22px; height: 22px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: left .2s; }
.toggle input:checked + .toggle-switch { background: var(--gold); }
.toggle input:checked + .toggle-switch::after { left: 22px; }
.empty-state { text-align: center; padding: 4rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text-muted); }
.empty-state h3 { font-size: 18px; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
.empty-state p { font-size: 14px; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(5,12,25,0.85); display: flex; align-items: center; justify-content: center; z-index: 300; }
.modal { background: var(--navy-2); border: 1px solid var(--border); border-radius: 14px; padding: 1.75rem; width: 560px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.modal-header h3 { font-size: 17px; font-weight: 600; }
.close-btn { background: none; border: none; color: var(--text-muted); font-size: 24px; cursor: pointer; line-height: 1; }
.close-btn:hover { color: var(--text-main); }
.cat-select-row { display: flex; gap: 8px; margin-top: 4px; }
.cat-select-btn { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--navy); color: var(--text-muted); font-size: 13px; cursor: pointer; font-family: var(--font); transition: all .2s; }
.cat-select-btn.active { background: rgba(201,168,76,0.15); color: var(--gold); border-color: rgba(201,168,76,0.5); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 5px; }
.form-input { width: 100%; background: var(--navy); border: 1px solid var(--border); border-radius: 7px; padding: 9px 12px; color: var(--text-main); font-size: 13px; font-family: var(--font); outline: none; resize: vertical; }
.form-input:focus { border-color: var(--gold); }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 1rem; border-top: 1px solid var(--border); margin-top: .5rem; }
.btn-primary { background: var(--gold); color: var(--navy); border: none; padding: 9px 20px; border-radius: 7px; font-size: 14px; font-weight: 600; font-family: var(--font); cursor: pointer; transition: opacity .2s; }
.btn-primary:hover { opacity: .85; }
.btn-outline { background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 9px 20px; border-radius: 7px; font-size: 14px; font-family: var(--font); cursor: pointer; transition: all .2s; }
.btn-outline:hover { color: var(--text-main); border-color: var(--text-muted); }
@media (max-width: 768px) {
  .sidebar { width: 60px; }
  .sidebar-header, .dashboard-title, .dashboard-subtitle, .nav-label { display: none; }
  .nav-item { justify-content: center; padding: 12px; }
  .dashboard-content { margin-left: 60px; padding: 1rem; }
  .stats-grid, .actions-grid { grid-template-columns: 1fr 1fr; }
  .properties-grid { grid-template-columns: 1fr; }
}
</style>
