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
                >{{ location }}</div>
              </div>
            </div>
            <select v-model="filters.price" class="rent-select">
              <option value="">Any Price</option>
              <option value="0-1000">Under RWF 1,000</option>
              <option value="1000-50000">RWF 1,000 – 50,000</option>
              <option value="50000-100000">RWF 50,000 – 100,000</option>
              <option value="100000-999999999">RWF 100,000+</option>
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
            <div v-else class="details locked-details">Log in to view rental details</div>

            <div class="bottom">
              <div class="price-section">
                <span class="price-label">From</span>
                <h4>{{ formatRWF(property.price) }}<span>/month</span></h4>
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
        <button class="cta-btn" @click="router.push('/contacts')">
          {{ auth.isLoggedIn ? 'Browse &amp; Enquire' : 'Log in to Browse' }}
        </button>
      </div>
    </section>

    <!-- ── ENQUIRY MODAL ────────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">

          <button class="modal-close" @click="closeModal">✕</button>
          <h2 class="modal-title">Rental Enquiry Form</h2>

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
                <span class="summary-val">{{ formatRWF(selectedProp?.price) }}/month</span>
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

          <div v-if="formError"   class="form-error">{{ formError }}</div>
          <div v-if="formSuccess" class="form-success">✅ Enquiry sent successfully!</div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-send"   @click="submitEnquiry">Send Enquiry</button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListingsStore }  from '@/stores/listings'
import { formatRWF }         from '@/stores/listings'
import { useAuthStore }      from '@/stores/auth'
import { useUsersStore }     from '@/stores/users'
import { useEnquiriesStore } from '@/stores/enquiries'
import image1 from '../assets/images/image1.png'
import image2 from '../assets/images/image2.png'
import image3 from '../assets/images/image3.png'

const route    = useRoute()
const router   = useRouter()
const listings = useListingsStore()
const auth     = useAuthStore()
const users    = useUsersStore()
const enquiries = useEnquiriesStore()
const heroImage = image1

const searchQuery      = ref(route.query.location || '')
const showSuggestions  = ref(false)
const filteredLocations = ref([])
const filters = reactive({
  category: route.query.category || '',
  location: route.query.location || '',
  price:    route.query.price    || '',
})

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

const rwandaLocations = [
  'Kigali','Kigali Heights','Nyarutarama','Kicukiro','Remera','Kimihurura',
  'Kibagabaga','Gisozi','Muhima','Gacuriro','Butare','Gitarama','Musanze',
  'Ruhengeri','Rubavu','Nyagatare','Kayonza','Gakenke','Bugesera','Nyanza','Muhanga',
]

const filterLocations = () => {
  filteredLocations.value = searchQuery.value.trim()
    ? rwandaLocations.filter(l => l.toLowerCase().includes(searchQuery.value.toLowerCase()))
    : rwandaLocations
}
const selectLocation = (location) => {
  searchQuery.value  = location
  filters.location   = location
  showSuggestions.value = false
}
function applyLocationSearch() {
  filters.location = searchQuery.value
}

const demoProperties = [
  { id: 1, name: 'Modern Apartment', location: 'Kigali Heights', price: 800,  bedrooms: 2, bathrooms: 2, size: '120m²', type: 'Apartment' },
  { id: 2, name: 'Luxury Villa',     location: 'Nyarutarama',    price: 1500, bedrooms: 4, bathrooms: 3, size: '300m²', type: 'Villa'     },
  { id: 3, name: 'Family House',     location: 'Kicukiro',       price: 600,  bedrooms: 3, bathrooms: 2, size: '180m²', type: 'House'     },
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

function handleEnquire(property) {
  if (!auth.isLoggedIn) {
    alert('Please log in to send an enquiry.')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  if (!property) return
  selectedProp.value  = property
  form.name       = auth.user?.name  || ''
  form.email      = auth.user?.email || ''
  form.phone      = ''
  form.message    = ''
  form.dateNeeded = ''
  formError.value   = ''
  formSuccess.value = false
  showModal.value   = true
}

function closeModal() {
  showModal.value    = false
  selectedProp.value = null
}

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

const stats = [
  { value: '500+', label: 'Properties'   },
  { value: '120+', label: 'Locations'    },
  { value: '98%',  label: 'Satisfaction' },
  { value: '24/7', label: 'Support'      },
]
const categories = [
  { name: 'Houses',     icon: '🏠', count: 120 },
  { name: 'Apartments', icon: '🏢', count: 240 },
  { name: 'Villas',     icon: '🏰', count: 85  },
  { name: 'Offices',    icon: '🏬', count: 55  },
]
const whyUs = [
  { title: 'Verified Listings', description: 'All properties are thoroughly verified before publication for your peace of mind.'  },
  { title: 'Best Prices',       description: 'Most competitive rental offers in Kigali and across Rwanda.'                        },
  { title: 'Secure Process',    description: 'Safe and transparent rental transactions with buyer protection.'                    },
]
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.property-page { font-family: var(--font, 'Poppins', sans-serif); background: var(--navy); color: var(--text-main); }
.hero { position: relative; height: 640px; display: flex; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.overlay { position: relative; z-index: 2; width: 100%; height: 100%; display: flex; align-items: center; background: linear-gradient(to right, rgba(10,22,40,0.94) 42%, rgba(10,22,40,0.45)); color: var(--text-main); padding: 0 4rem; animation: fadeInDown 0.8s ease-out; }
.hero-content { max-width: 900px; }
.hero-content h1 { font-size: 52px; line-height: 1.15; margin-bottom: 1rem; font-weight: 700; color: var(--text-main); }
.hero-content p  { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.75rem; }
.search-box { display: flex; align-items: center; gap: 0; margin-top: 30px; max-width: 980px; background: rgba(255,255,255,0.07); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; overflow: visible; }
.search-container { position: relative; width: 280px; }
.rent-select { padding: 14px 16px; border: none; border-right: 1px solid rgba(255,255,255,0.15); border-radius: 0; font-size: 13px; outline: none; min-width: 180px; background: transparent; color: var(--text-main); font-family: var(--font); }
.rent-select option { background: var(--navy-2); }
.search-box input { width: 100%; padding: 14px 16px; border: none; border-right: 1px solid rgba(255,255,255,0.15); border-radius: 0; font-size: 13px; outline: none; background: transparent; color: var(--text-main); font-family: var(--font); }
.search-box input::placeholder { color: var(--text-muted); }
.search-box input:focus, .rent-select:focus { box-shadow: inset 0 -2px 0 var(--gold); }
.suggestions-dropdown { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: var(--navy-2); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 18px 40px rgba(0,0,0,0.35); max-height: 300px; overflow-y: auto; z-index: 1000; }
.suggestion-item { padding: 11px 14px; cursor: pointer; border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 13px; }
.suggestion-item:hover { background: rgba(201,168,76,0.12); color: var(--gold); }
.search-box button { align-self: stretch; padding: 14px 28px; border: none; background: var(--gold); color: var(--navy); cursor: pointer; font-weight: 700; font-family: var(--font); }
.search-box button:hover { opacity: .85; }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); padding: 2rem; gap: 0; background: var(--navy-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stat { text-align: center; padding: 1rem; background: transparent; border-right: 1px solid var(--border); transition: color .2s; }
.stat:last-child { border-right: none; }
.stat h2 { color: var(--gold); font-size: 36px; margin-bottom: 4px; font-weight: 700; }
.stat p  { color: var(--text-muted); font-size: 13px; font-weight: 500; }
.section-header { text-align: center; margin-bottom: 2rem; }
.section-title    { font-size: 30px; color: var(--text-main); margin-bottom: .5rem; font-weight: 700; }
.section-subtitle { font-size: 14px; color: var(--text-muted); max-width: 600px; margin: 0 auto; }
.featured, .why-us { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
.property-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.property-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: transform .2s, border-color .2s; cursor: pointer; }
.property-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.4); }
.property-image-wrapper { position: relative; overflow: hidden; height: 190px; }
.property-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .3s; }
.property-card:hover .property-img { transform: scale(1.04); }
.property-badge { position: absolute; top: 10px; right: 10px; background: rgba(127,224,176,0.9); color: var(--navy); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize; }
.property-content { padding: 1rem; }
.property-content h3 { font-size: 15px; color: var(--text-main); margin-bottom: 4px; font-weight: 600; }
.location { color: var(--text-muted); font-size: 13px; margin-bottom: 12px; }
.details { display: flex; gap: 10px; margin: 14px 0; flex-wrap: wrap; min-height: 32px; }
.locked-details { color: var(--text-muted); font-size: 13px; font-style: italic; margin: 14px 0; }
.detail-item { display: inline-flex; align-items: center; background: rgba(201,168,76,0.08); border: 1px solid var(--border); padding: 6px 10px; border-radius: 7px; font-size: 12px; color: var(--text-muted); }
.bottom { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
.price-section h4 { font-size: 15px; color: var(--gold); font-weight: 700; }
.price-section span { font-size: 12px; color: var(--text-muted); }
.price-label { display: block; font-size: 11px; color: var(--text-muted); margin-bottom: 3px; }
.view-btn { background: rgba(201,168,76,0.1); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); padding: 9px 14px; border-radius: 7px; cursor: pointer; font-weight: 600; transition: background .2s; white-space: nowrap; }
.view-btn:hover { background: rgba(201,168,76,0.2); }
.categories { padding: 5rem 2rem; background: var(--navy-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.category-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.category-card { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; text-align: center; border-radius: var(--radius); transition: border-color .2s, transform .2s; }
.category-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); }
.category-icon { font-size: 28px; margin-bottom: 10px; }
.category-card h3 { font-size: 15px; margin-bottom: 6px; font-weight: 600; color: var(--text-main); }
.category-card p  { font-size: 12px; color: var(--text-muted); }
.why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.why-card { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: var(--radius); transition: border-color .2s; }
.why-card:hover { border-color: rgba(201,168,76,0.4); }
.why-card h3 { font-size: 15px; color: var(--text-main); margin-bottom: .5rem; font-weight: 600; }
.why-card p  { color: var(--text-muted); line-height: 1.6; font-size: 13px; }
.cta { background: var(--navy-2); border-top: 1px solid var(--border); color: var(--text-main); padding: 5rem 2rem; text-align: center; }
.cta-content { max-width: 700px; margin: 0 auto; }
.cta h2  { font-size: 32px; margin-bottom: 1rem; font-weight: 700; }
.cta p   { font-size: 15px; margin-bottom: 2rem; color: var(--text-muted); line-height: 1.7; }
.cta-btn { padding: 12px 28px; border: none; border-radius: 8px; background: var(--gold); color: var(--navy); font-weight: 700; font-size: 14px; cursor: pointer; transition: opacity .2s; }
.cta-btn:hover { opacity: .85; }
/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(5,12,25,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal { background: var(--navy-2); border: 1px solid var(--border); border-radius: 14px; padding: 1.75rem; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.35); }
.modal-close { position: absolute; top: 14px; right: 14px; background: transparent; border: 1px solid var(--border); color: var(--text-muted); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
.modal-close:hover { color: var(--text-main); border-color: var(--gold); }
.modal-title { font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 1.25rem; }
.prop-summary { display: flex; gap: 14px; background: rgba(201,168,76,0.06); border: 1px solid var(--border); border-radius: 10px; padding: 12px; }
.summary-img { width: 90px; height: 70px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.summary-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.summary-name { font-weight: 600; font-size: 14px; color: var(--text-main); margin-bottom: 4px; }
.summary-row  { display: flex; gap: 8px; font-size: 12px; }
.summary-label { color: var(--text-muted); min-width: 80px; }
.summary-val   { color: var(--text-main); font-weight: 500; }
.divider { height: 1px; background: var(--border); margin: 1.25rem 0; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-row { display: flex; flex-direction: column; gap: 5px; }
.form-row.full { grid-column: 1 / -1; }
.form-row label { font-size: 12px; color: var(--text-muted); font-weight: 500; }
.form-row input, .form-row textarea { border: 1px solid var(--border); border-radius: 8px; padding: 9px 11px; color: var(--text-main); background: var(--navy); font-family: var(--font); font-size: 13px; outline: none; }
.form-row input:focus, .form-row textarea:focus { border-color: var(--gold); }
.form-row textarea { resize: vertical; }
.form-error   { color: #ef4444; font-size: 13px; margin-top: 10px; }
.form-success { color: #7fe0b0; font-size: 13px; margin-top: 10px; font-weight: 600; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.25rem; }
.btn-cancel { padding: 9px 20px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-family: var(--font); font-size: 13px; }
.btn-cancel:hover { border-color: var(--gold); color: var(--text-main); }
.btn-send { padding: 9px 24px; border-radius: 8px; border: none; background: var(--gold); color: var(--navy); font-weight: 700; cursor: pointer; font-family: var(--font); font-size: 13px; }
.btn-send:hover { opacity: .88; transform: translateY(-1px); }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 768px) {
  .hero { height: auto; min-height: 640px; }
  .overlay { padding: 6rem 1.25rem 3rem; }
  .hero-content h1 { font-size: 36px; }
  .search-box { flex-direction: column; }
  .search-container, .rent-select, .search-box button { width: 100%; }
  .rent-select, .search-box input { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.15); }
  .section-title { font-size: 2rem; }
  .property-grid, .why-grid { grid-template-columns: 1fr; }
  .category-grid { grid-template-columns: repeat(2,1fr); }
  .cta h2 { font-size: 2rem; }
  .stats { grid-template-columns: repeat(2,1fr); padding: 1.5rem; }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
