<template>
  <div class="property-page">

    <!-- HERO -->
    <section class="hero">
      <img :src="heroImage" alt="Hero Background" class="hero-bg" />
      <div class="overlay">
        <div class="hero-content">
          <h1>Find Your Perfect Rental Property</h1>
          <p>Browse apartments, houses, villas and offices across Rwanda.</p>

          <div class="search-box">
            <select v-model="filters.category" class="rent-select">
              <option value="">All Categories</option>
              <option value="house">Houses</option>
              <option value="land">Land</option>
              <option value="car">Cars</option>
            </select>
            <div class="search-container">
              <input
                type="text"
                placeholder="Search by location..."
                v-model="searchQuery"
                @input="filterLocations"
                @focus="showSuggestions = true"
                @blur="setTimeout(() => showSuggestions = false, 200)"
              />
              <div class="suggestions-dropdown" v-if="showSuggestions && filteredLocations.length">
                <div
                  class="suggestion-item"
                  v-for="location in filteredLocations"
                  :key="location"
                  @click="selectLocation(location)"
                >
                  {{ location }}
                </div>
              </div>
            </div>
            <select v-model="filters.price" class="rent-select">
              <option value="">Any Price</option>
              <option value="0-1000">Under $1k</option>
              <option value="1000-50000">$1k - $50k</option>
              <option value="50000-100000">$50k - $100k</option>
              <option value="100000-999999999">$100k+</option>
            </select>
            <button @click="applyLocationSearch">Search</button>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats">
      <div class="stat" v-for="(stat, index) in stats" :key="index">
        <h2>{{ stat.value }}</h2>
        <p>{{ stat.label }}</p>
      </div>
    </section>

    <!-- FEATURED PROPERTIES -->
    <section class="featured">
      <div class="section-header">
        <h2 class="section-title">Featured Properties</h2>
        <p class="section-subtitle">Discover our handpicked selection of premium rentals</p>
      </div>

      <div class="property-grid">
        <div class="property-card" v-for="property in properties" :key="property.id">
          <div class="property-image-wrapper">
            <img :src="property.image || getPropertyImage(property.id)" :alt="property.name" class="property-img" />
            <div class="property-badge">{{ property.type }}</div>
          </div>

          <div class="property-content">
            <h3>{{ property.name }}</h3>
            <p class="location">{{ property.location }}</p>

            <div v-if="auth.isLoggedIn" class="details">
              <span class="detail-item">{{ property.bedrooms }} Bed</span>
              <span class="detail-item">{{ property.bathrooms }} Bath</span>
              <span class="detail-item">{{ property.size }}</span>
            </div>
            <div v-else class="details locked-details">
              Log in to view rental details
            </div>

            <div class="bottom">
              <div class="price-section">
                <span class="price-label">From</span>
                <h4>${{ property.price }}<span>/month</span></h4>
              </div>
              <button class="view-btn" @click="handleEnquire(property)">
                {{ auth.isLoggedIn ? 'Enquire Now' : 'Log in to Enquire' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="categories">
      <div class="section-header">
        <h2 class="section-title">Property Types</h2>
        <p class="section-subtitle">Find the perfect property type for your needs</p>
      </div>
      <div class="category-grid">
        <div class="category-card" v-for="(category, index) in categories" :key="index">
          <div class="category-icon">{{ category.icon }}</div>
          <h3>{{ category.name }}</h3>
          <p>{{ category.count }} properties</p>
        </div>
      </div>
    </section>

    <!-- WHY US -->
    <section class="why-us">
      <div class="section-header">
        <h2 class="section-title">Why Choose Us?</h2>
        <p class="section-subtitle">Your trusted partner in finding the perfect home</p>
      </div>
      <div class="why-grid">
        <div class="why-card" v-for="(reason, index) in whyUs" :key="index">
          <h3>{{ reason.title }}</h3>
          <p>{{ reason.description }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-content">
        <h2>Ready To Find Your Next Home?</h2>
        <p>Join thousands of satisfied renters who found their perfect property with us</p>
        <button class="cta-btn" @click="handleEnquire(null)">
          {{ auth.isLoggedIn ? 'Browse & Enquire' : 'Log in to Browse' }}
        </button>
      </div>
    </section>

    <!-- ── ENQUIRY MODAL ────────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">

          <button class="modal-close" @click="closeModal">✕</button>
          <h2 class="modal-title">Rental Enquiry Form</h2>

          <!-- Property summary card -->
          <div class="prop-summary">
            <img
              v-if="selectedProp?.image || getPropertyImage(selectedProp?.id)"
              :src="selectedProp?.image || getPropertyImage(selectedProp?.id)"
              class="summary-img"
            />
            <div class="summary-info">
              <div class="summary-name">{{ selectedProp?.name || selectedProp?.title }}</div>
              <div class="summary-row">
                <span class="summary-label">Price</span>
                <span class="summary-val">${{ selectedProp?.price?.toLocaleString() }}/month</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Category</span>
                <span class="summary-val">{{ selectedProp?.category || selectedProp?.type }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Lendee</span>
                <span class="summary-val">{{ getLendeeName(selectedProp?.sellerId) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Lendee email</span>
                <span class="summary-val">{{ getLendeeEmail(selectedProp?.sellerId) }}</span>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Viewer enquiry fields -->
          <div class="form-grid">
            <div class="form-row">
              <label>Your name</label>
              <input v-model="form.name" type="text" placeholder="Full name" />
            </div>
            <div class="form-row">
              <label>Your email</label>
              <input v-model="form.email" type="email" placeholder="you@email.com" />
            </div>
            <div class="form-row">
              <label>Phone number</label>
              <input v-model="form.phone" type="tel" placeholder="+250 7XX XXX XXX" />
            </div>
            <div class="form-row">
              <label>Date needed</label>
              <input v-model="form.dateNeeded" type="date" />
            </div>
            <div class="form-row full">
              <label>Message</label>
              <textarea v-model="form.message" rows="3" placeholder="I am interested in renting this property. Is it still available?"></textarea>
            </div>
          </div>

          <div v-if="formError" class="form-error">{{ formError }}</div>
          <div v-if="formSuccess" class="form-success">✅ Enquiry sent successfully!</div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-send" @click="submitEnquiry">Send Enquiry</button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useEnquiriesStore } from '@/stores/enquiries'
import image1 from '../assets/images/image1.png'
import image2 from '../assets/images/image2.png'
import image3 from '../assets/images/image3.png'

const route = useRoute()
const router = useRouter()
const listings = useListingsStore()
const auth = useAuthStore()
const users = useUsersStore()
const enquiries = useEnquiriesStore()
const heroImage = image1

const searchQuery = ref(route.query.location || '')
const showSuggestions = ref(false)
const filteredLocations = ref([])
const filters = reactive({
  category: route.query.category || '',
  location: route.query.location || '',
  price: route.query.price || '',
})

// ── Modal state ──────────────────────────────────────────────────
const showModal    = ref(false)
const selectedProp = ref(null)
const formError    = ref('')
const formSuccess  = ref(false)

const form = reactive({
  name:       auth.user?.name  || '',
  email:      auth.user?.email || '',
  phone:      '',
  message:    '',
  dateNeeded: '',
})

// ── Location helpers ─────────────────────────────────────────────
const rwandaLocations = [
  'Kigali','Kigali Heights','Nyarutarama','Kicukiro','Remera','Kimihurura',
  'Kibagabaga','Gisozi','Muhima','Gacuriro','Butare','Gitarama','Musanze',
  'Ruhengeri','Rubavu','Nyagatare','Kayonza','Gakenke','Bugesera','Nyanza','Muhanga'
]

const filterLocations = () => {
  filteredLocations.value = searchQuery.value.trim()
    ? rwandaLocations.filter(l => l.toLowerCase().includes(searchQuery.value.toLowerCase()))
    : rwandaLocations
}
const selectLocation = (location) => {
  searchQuery.value = location
  filters.location = location
  showSuggestions.value = false
}
function applyLocationSearch() {
  filters.location = searchQuery.value
}

// ── Properties ───────────────────────────────────────────────────
const demoProperties = [
  { id: 1, name: 'Modern Apartment', location: 'Kigali Heights', price: 800, bedrooms: 2, bathrooms: 2, size: '120m²', type: 'Apartment' },
  { id: 2, name: 'Luxury Villa',     location: 'Nyarutarama',    price: 1500, bedrooms: 4, bathrooms: 3, size: '300m²', type: 'Villa' },
  { id: 3, name: 'Family House',     location: 'Kicukiro',       price: 600, bedrooms: 3, bathrooms: 2, size: '180m²', type: 'House' },
]

const properties = computed(() => {
  const storeRentals = listings.properties
    .filter((p) => {
      if (p.mode !== 'rent') return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.price) {
        const [min, max] = filters.price.split('-').map(Number)
        if (p.price < min || p.price > max) return false
      }
      return true
    })
    .map((p) => ({
      ...p,
      name: p.title,
      size: p.category === 'land' ? 'Plot' : p.category === 'car' ? 'Daily hire' : 'Home',
    }))
  return listings.properties.some(p => p.mode === 'rent') ? storeRentals : demoProperties
})

function getPropertyImage(id) {
  return { 1: image1, 2: image2, 3: image3 }[id] || image1
}

function getLendeeName(sellerId) {
  if (!sellerId) return 'Property owner'
  const u = users.findById(sellerId)
  return u ? u.name : 'Property owner'
}
function getLendeeEmail(sellerId) {
  if (!sellerId) return '—'
  const u = users.findById(sellerId)
  return u ? u.email : '—'
}

// ── Modal open / close ───────────────────────────────────────────
function handleEnquire(property) {
  if (!auth.isLoggedIn) {
    alert('Please log in to send an enquiry.')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  if (!property) return   // CTA button with no property selected
  selectedProp.value = property
  form.name       = auth.user?.name  || ''
  form.email      = auth.user?.email || ''
  form.phone      = ''
  form.message    = ''
  form.dateNeeded = ''
  formError.value   = ''
  formSuccess.value = false
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedProp.value = null
}

// ── Submit ───────────────────────────────────────────────────────
function submitEnquiry() {
  formError.value = ''
  if (!form.name || !form.email || !form.message) {
    formError.value = 'Please fill in your name, email, and message.'
    return
  }
  enquiries.sendEnquiry({
    fromName:      form.name,
    fromEmail:     form.email,
    fromPhone:     form.phone,
    dateNeeded:    form.dateNeeded,
    propertyId:    selectedProp.value.id,
    sellerId:      selectedProp.value.sellerId,
    propertyTitle: selectedProp.value.name || selectedProp.value.title,
    message:       form.message,
    createdAt:     new Date().toISOString().split('T')[0],
  })
  formSuccess.value = true
  setTimeout(() => closeModal(), 1800)
}

// ── Static data ──────────────────────────────────────────────────
const stats = [
  { value: '500+', label: 'Properties' },
  { value: '120+', label: 'Locations'  },
  { value: '98%',  label: 'Satisfaction' },
  { value: '24/7', label: 'Support'    },
]
const categories = [
  { name: 'Houses',     icon: '🏠', count: 120 },
  { name: 'Apartments', icon: '🏢', count: 240 },
  { name: 'Villas',     icon: '🏰', count: 85  },
  { name: 'Offices',    icon: '🏬', count: 55  },
]
const whyUs = [
  { title: 'Verified Listings', description: 'All properties are thoroughly verified before publication for your peace of mind.' },
  { title: 'Best Prices',       description: 'Most competitive rental offers in Kigali and across Rwanda.' },
  { title: 'Secure Process',    description: 'Safe and transparent rental transactions with buyer protection.' },
]
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.property-page { font-family: 'Poppins', sans-serif; background: #f9fafb; }

/* HERO */
.hero { position: relative; height: 90vh; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.overlay { position: relative; z-index: 2; text-align: center; color: white; background: rgba(0,0,0,0.4); padding: 60px 40px; border-radius: 25px; backdrop-filter: blur(5px); max-width: 700px; animation: fadeInDown 0.8s ease-out; }
.hero-content h1 { font-size: 4rem; margin-bottom: 20px; font-weight: 800; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); }
.hero-content p  { font-size: 1.3rem; margin-bottom: 30px; text-shadow: 1px 1px 4px rgba(0,0,0,0.3); }
.search-box { display: flex; gap: 12px; justify-content: center; margin-top: 30px; flex-wrap: wrap; }
.search-container { position: relative; width: 350px; }
.rent-select { padding: 15px 16px; border: none; border-radius: 12px; font-size: 1rem; outline: none; min-width: 180px; background: white; color: #374151; }
.search-box input { width: 100%; padding: 15px 20px; border: none; border-radius: 12px; font-size: 1rem; outline: none; }
.search-box input:focus { box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
.suggestions-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); max-height: 300px; overflow-y: auto; z-index: 1000; margin-top: 5px; }
.suggestion-item { padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #f0f0f0; color: #374151; font-size: .95rem; }
.suggestion-item:hover { background: #f0fdf4; color: #10b981; padding-left: 25px; }
.search-box button { padding: 15px 35px; border: none; background: linear-gradient(135deg,#10b981,#059669); color: white; border-radius: 12px; cursor: pointer; font-weight: 600; }
.search-box button:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(16,185,129,0.3); }

/* STATS */
.stats { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); padding: 80px 10%; gap: 30px; background: linear-gradient(135deg,#f0fdf4,#ecfdf5); }
.stat { text-align: center; padding: 30px; background: white; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); transition: all .3s; }
.stat:hover { transform: translateY(-8px); box-shadow: 0 15px 40px rgba(16,185,129,0.15); }
.stat h2 { color: #10b981; font-size: 2.8rem; margin-bottom: 10px; font-weight: 700; }
.stat p  { color: #6b7280; font-size: 1rem; font-weight: 500; }

/* SECTION HEADER */
.section-header { text-align: center; margin-bottom: 50px; }
.section-title    { font-size: 3rem; color: #1f2937; margin-bottom: 15px; font-weight: 800; }
.section-subtitle { font-size: 1.1rem; color: #6b7280; max-width: 600px; margin: 0 auto; }

/* FEATURED */
.featured { padding: 80px 10%; }
.property-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(330px,1fr)); gap: 35px; }
.property-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all .4s; cursor: pointer; }
.property-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(16,185,129,0.15); }
.property-image-wrapper { position: relative; overflow: hidden; height: 270px; }
.property-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
.property-card:hover .property-img { transform: scale(1.08); }
.property-badge { position: absolute; top: 15px; right: 15px; background: linear-gradient(135deg,#10b981,#059669); color: white; padding: 8px 16px; border-radius: 25px; font-size: .85rem; font-weight: 600; }
.property-content { padding: 28px; }
.property-content h3 { font-size: 1.5rem; color: #1f2937; margin-bottom: 12px; }
.location { color: #6b7280; font-size: .95rem; margin-bottom: 20px; }
.details { display: flex; gap: 15px; margin: 25px 0; flex-wrap: wrap; }
.locked-details { color: #9ca3af; font-size: .9rem; font-style: italic; margin: 25px 0; }
.detail-item { display: inline-flex; align-items: center; gap: 6px; background: #f3f4f6; padding: 8px 12px; border-radius: 8px; font-size: .9rem; color: #374151; }
.bottom { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
.price-section h4 { font-size: 1.8rem; color: #10b981; font-weight: 700; }
.price-section span { font-size: .85rem; color: #6b7280; }
.price-label { display: block; font-size: .8rem; color: #9ca3af; margin-bottom: 3px; }
.view-btn { background: linear-gradient(135deg,#10b981,#059669); color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all .3s; }
.view-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16,185,129,0.3); }

/* CATEGORIES */
.categories { padding: 80px 10%; background: linear-gradient(135deg,#f0fdf4,#ecfdf5); }
.category-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 25px; }
.category-card { background: white; padding: 40px 30px; text-align: center; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); transition: all .3s; }
.category-card:hover { background: linear-gradient(135deg,#10b981,#059669); color: white; transform: translateY(-8px); }
.category-icon { font-size: 2rem; margin-bottom: 15px; }
.category-card h3 { font-size: 1.3rem; margin-bottom: 10px; font-weight: 700; }
.category-card p  { font-size: .9rem; opacity: .8; }

/* WHY US */
.why-us { padding: 80px 10%; }
.why-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 35px; }
.why-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border-left: 4px solid #10b981; transition: all .3s; }
.why-card:hover { transform: translateY(-8px); }
.why-card h3 { font-size: 1.3rem; color: #1f2937; margin-bottom: 15px; font-weight: 700; }
.why-card p  { color: #6b7280; line-height: 1.6; }

/* CTA */
.cta { background: linear-gradient(135deg,#10b981,#059669); color: white; padding: 100px 20px; text-align: center; }
.cta-content { max-width: 700px; margin: 0 auto; }
.cta h2  { font-size: 2.8rem; margin-bottom: 20px; font-weight: 800; }
.cta p   { font-size: 1.1rem; margin-bottom: 35px; opacity: .95; line-height: 1.6; }
.cta-btn { padding: 16px 45px; border: none; border-radius: 12px; background: white; color: #10b981; font-weight: 700; font-size: 1.05rem; cursor: pointer; transition: all .3s; }
.cta-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }

/* ── Modal ───────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.65);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.modal {
  background: white; border-radius: 16px; padding: 2rem;
  width: 100%; max-width: 560px; max-height: 90vh;
  overflow-y: auto; position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,0.25);
}
.modal-close {
  position: absolute; top: 14px; right: 14px;
  background: transparent; border: 1px solid #e5e7eb;
  color: #9ca3af; width: 32px; height: 32px;
  border-radius: 50%; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { color: #1f2937; border-color: #10b981; }
.modal-title { font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 1.25rem; }

.prop-summary {
  display: flex; gap: 14px; background: #f0fdf4;
  border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px;
}
.summary-img { width: 90px; height: 70px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.summary-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.summary-name { font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 4px; }
.summary-row  { display: flex; gap: 8px; font-size: 12px; }
.summary-label { color: #6b7280; min-width: 80px; }
.summary-val   { color: #1f2937; font-weight: 500; }

.divider { height: 1px; background: #e5e7eb; margin: 1.25rem 0; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-row { display: flex; flex-direction: column; gap: 5px; }
.form-row.full { grid-column: 1 / -1; }
.form-row label { font-size: 12px; color: #6b7280; font-weight: 500; }
.form-row input, .form-row textarea {
  border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 9px 11px; color: #1f2937;
  font-family: 'Poppins', sans-serif; font-size: 13px; outline: none;
}
.form-row input:focus, .form-row textarea:focus { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16,185,129,0.15); }
.form-row textarea { resize: vertical; }

.form-error   { color: #ef4444; font-size: 13px; margin-top: 10px; }
.form-success { color: #10b981; font-size: 13px; margin-top: 10px; font-weight: 600; }

.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.25rem; }
.btn-cancel { padding: 9px 20px; border-radius: 8px; border: 1px solid #e5e7eb; background: transparent; color: #6b7280; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 13px; }
.btn-cancel:hover { border-color: #10b981; color: #1f2937; }
.btn-send { padding: 9px 24px; border-radius: 8px; border: none; background: linear-gradient(135deg,#10b981,#059669); color: white; font-weight: 700; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 13px; }
.btn-send:hover { opacity: .88; transform: translateY(-1px); }

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.5rem; }
  .search-box { flex-direction: column; }
  .search-container { width: 100%; }
  .section-title { font-size: 2rem; }
  .property-grid { grid-template-columns: 1fr; }
  .category-grid { grid-template-columns: repeat(2,1fr); }
  .cta h2 { font-size: 2rem; }
  .stats { grid-template-columns: repeat(2,1fr); padding: 50px 5%; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>