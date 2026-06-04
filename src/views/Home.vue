<template>
  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop"
          alt="Hero"
          class="hero-img"
        />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">🇷🇼 Rwanda's #1 Marketplace</div>
        <h1 class="hero-title">
          Buy, Sell or Rent<br />
          <span class="gold">Houses, Land & Cars</span>
        </h1>
        <p class="hero-sub">
          Find houses, land plots, and vehicles across Rwanda.<br />
          Trusted sellers. Thousands of listings. Simple process.
        </p>
        <div class="hero-actions">
          <RouterLink to="/property/buy"  class="btn-hero-primary">Browse Listings</RouterLink>
          <RouterLink to="/property/rent" class="btn-hero-outline">Browse Rentals</RouterLink>
        </div>

        <!-- Search bar -->
        <div class="search-bar">
          <select v-model="search.category" class="search-select">
            <option value="">All Categories</option>
            <option value="house">Houses</option>
            <option value="land">Land</option>
            <option value="car">Cars</option>
          </select>
          <div class="search-divider"></div>
          <select v-model="search.mode" class="search-select">
            <option value="sell">Buy</option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent / Hire</option>
          </select>
          <div class="search-divider"></div>
          <select v-model="search.location" class="search-select">
            <option value="">All Locations</option>
            <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
          </select>
          <div class="search-divider"></div>
          <select v-model="search.price" class="search-select">
            <option value="">Any Price</option>
            <option value="0-100000">Under RWF 100k</option>
            <option value="100000-500000">RWF 100k - 500k</option>
            <option value="500000-1000000">RWF 500k - 1M</option>
            <option value="1000000-999999999">RWF 1M+</option>
          </select>
          <RouterLink :to="searchTarget" class="btn-search">Search</RouterLink>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-section">
      <div class="stats-inner">
        <div class="stat-item">
          <div class="stat-number">{{ listings.properties.length }}+</div>
          <div class="stat-label">Active Listings</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">{{ houseCount }}+</div>
          <div class="stat-label">Houses & Apartments</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">{{ landCount }}+</div>
          <div class="stat-label">Land Plots</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">{{ carCount }}+</div>
          <div class="stat-label">Vehicles</div>
        </div>
      </div>
    </section>

    <!-- CATEGORY CARDS -->
    <section class="section">
      <div class="section-inner">
        <div class="section-head centered">
          <div class="section-tag">What are you looking for?</div>
          <h2 class="section-title">Browse by Category</h2>
        </div>
        <div class="cat-grid">
          <RouterLink to="/property/buy" class="cat-card">
            <div class="cat-img-wrap">
              <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop" class="cat-img" alt="Houses" />
              <div class="cat-overlay"></div>
            </div>
            <div class="cat-body">
              <div class="cat-icon">🏠</div>
              <div class="cat-name">Houses</div>
              <div class="cat-count">{{ houseCount }} listings</div>
            </div>
          </RouterLink>
          <RouterLink to="/property/buy" class="cat-card">
            <div class="cat-img-wrap">
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop" class="cat-img" alt="Land" />
              <div class="cat-overlay"></div>
            </div>
            <div class="cat-body">
              <div class="cat-icon">🌍</div>
              <div class="cat-name">Land</div>
              <div class="cat-count">{{ landCount }} listings</div>
            </div>
          </RouterLink>
          <RouterLink to="/property/buy" class="cat-card">
            <div class="cat-img-wrap">
              <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop" class="cat-img" alt="Cars" />
              <div class="cat-overlay"></div>
            </div>
            <div class="cat-body">
              <div class="cat-icon">🚗</div>
              <div class="cat-name">Cars</div>
              <div class="cat-count">{{ carCount }} listings</div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- FEATURED LISTINGS -->
    <section class="section" style="padding-top:0">
      <div class="section-inner">
        <div class="section-head">
          <div>
            <div class="section-tag">Featured</div>
            <h2 class="section-title">Latest Listings</h2>
          </div>
          <RouterLink to="/property/buy" class="btn-view-all">View All →</RouterLink>
        </div>

        <div class="prop-grid">
          <div v-for="p in featured" :key="p.id" class="prop-card">
            <div class="prop-img-wrap">
              <img :src="p.image" :alt="p.title" class="prop-img" />
              <span class="prop-cat-badge">{{ categoryIcon(p.category) }} {{ p.category }}</span>
              <span class="prop-mode" :class="p.mode">
                {{ p.mode === 'sell' ? 'For Sale' : 'For Rent' }}
              </span>
              <span class="prop-price">{{ formatPrice(p) }}</span>
            </div>
            <div class="prop-body">
              <div class="prop-name">{{ p.title }}</div>
              <div class="prop-loc">📍 {{ p.location }}</div>
              <div v-if="auth.isLoggedIn" class="prop-meta">
                <span v-if="p.category === 'house'">🛏 {{ p.bedrooms }} beds</span>
                <span v-if="p.category === 'house'">🚿 {{ p.bathrooms }} baths</span>
                <span>{{ p.type }}</span>
              </div>
              <div v-else class="prop-meta muted">Log in to view details</div>
              <RouterLink
                :to="listingTarget(p)"
                class="btn-view"
                @click="handlePropertyClick"
                :style="!auth.isLoggedIn ? 'opacity:0.75;' : ''"
              >{{ auth.isLoggedIn ? 'View Listing' : 'Log in to View' }}</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SHOWCASE -->
    <section class="arch-section">
      <div class="section-inner">
        <div class="section-head">
          <div>
            <div class="section-tag">Showcase</div>
            <h2 class="section-title">Premium Listings in Rwanda</h2>
          </div>
        </div>
        <div class="arch-grid">
          <div class="arch-main">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop" class="arch-img" alt="Villa" />
            <div class="arch-label">
              <div class="arch-title">🏡 Luxury Villas & Homes</div>
              <div class="arch-sub">Spacious, modern homes across Kigali</div>
            </div>
          </div>
          <div class="arch-side">
            <div class="arch-small">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop" class="arch-img" alt="Land" />
              <div class="arch-label">
                <div class="arch-title">🌍 Prime Land Plots</div>
                <div class="arch-sub">Residential & commercial plots available</div>
              </div>
            </div>
            <div class="arch-small">
              <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop" class="arch-img" alt="Cars" />
              <div class="arch-label">
                <div class="arch-title">🚗 Quality Vehicles</div>
                <div class="arch-sub">Buy or hire cars across Rwanda</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="section">
      <div class="section-inner">
        <div class="section-head centered">
          <div class="section-tag">Why NestLink</div>
          <h2 class="section-title">The Smarter Way to Buy, Sell & Rent</h2>
        </div>
        <div class="why-grid">
          <div class="why-card">
            <div class="why-icon">🔍</div>
            <div class="why-title">Easy Search</div>
            <div class="why-text">Filter by category, location, and price to find exactly what you need in seconds.</div>
          </div>
          <div class="why-card">
            <div class="why-icon">✅</div>
            <div class="why-title">Verified Sellers</div>
            <div class="why-text">Every listing is posted by a registered and verified seller. No scams.</div>
          </div>
          <div class="why-card">
            <div class="why-icon">💬</div>
            <div class="why-title">Direct Enquiries</div>
            <div class="why-text">Contact sellers directly and get fast responses.</div>
          </div>
          <div class="why-card">
            <div class="why-icon">📊</div>
            <div class="why-title">Seller Dashboard</div>
            <div class="why-text">Manage listings, track views, and respond to buyers all in one place.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA (hidden for sellers) -->
    <section v-if="!auth.isSeller" class="cta-section">
      <div class="cta-inner">
        <h2 class="cta-title">Ready to List Your Property or Vehicle?</h2>
        <p class="cta-sub">Join hundreds of sellers already using NestLink to reach buyers across Rwanda.</p>
        <RouterLink :to="{ path: '/login', query: { role: 'seller' } }" class="btn-hero-primary">
          Get Started as a Seller
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import { useAuthStore }     from '@/stores/auth'

const route = useRoute()
const listings = useListingsStore()
const auth     = useAuthStore()

const featured   = computed(() => listings.properties.slice(0, 6))
const houseCount = computed(() => listings.properties.filter(p => p.category === 'house').length)
const landCount  = computed(() => listings.properties.filter(p => p.category === 'land').length)
const carCount   = computed(() => listings.properties.filter(p => p.category === 'car').length)
const locations  = computed(() => [...new Set(listings.properties.map(p => p.location))])
const search = reactive({ category: '', mode: 'sell', location: '', price: '' })
const searchTarget = computed(() => ({
  path: search.mode === 'rent' ? '/property/rent' : '/property/buy',
  query: {
    ...(search.category ? { category: search.category } : {}),
    ...(search.location ? { location: search.location } : {}),
    ...(search.price ? { price: search.price } : {}),
  },
}))

function categoryIcon(cat) {
  return { house: '🏠', land: '🌍', car: '🚗' }[cat] || '📦'
}

function formatPrice(p) {
  const amount = `RWF ${p.price.toLocaleString()}`
  if (p.mode === 'rent') return p.category === 'car' ? `${amount}/day` : `${amount}/mo`
  return amount
}

function listingTarget(p) {
  const listingPath = p.mode === 'rent' ? '/property/rent' : '/property/buy'
  if (auth.isLoggedIn) return listingPath
  return {
    path: '/login',
    query: {
      redirect: route.fullPath,
      next: listingPath,
    },
  }
}

function handlePropertyClick(e) {
  if (!auth.isLoggedIn) {
    alert('Please log in or register to view full listing details.')
  }
}
</script>

<style scoped>
.home { background: var(--navy); }
.hero { position: relative; height: 640px; display: flex; align-items: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; }
.hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(10,22,40,0.93) 45%, rgba(10,22,40,0.4)); }
.hero-content { position: relative; z-index: 2; padding: 0 4rem; max-width: 700px; }
.hero-badge { display: inline-block; background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); padding: 6px 16px; border-radius: 20px; font-size: 13px; margin-bottom: 1.25rem; }
.hero-title { font-size: 52px; font-weight: 700; line-height: 1.15; margin-bottom: 1rem; color: var(--text-main); }
.gold { color: var(--gold); }
.hero-sub { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.75rem; }
.hero-actions { display: flex; gap: 12px; margin-bottom: 2rem; }
.btn-hero-primary { background: var(--gold); color: var(--navy); padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; transition: opacity .2s; display: inline-block; }
.btn-hero-primary:hover { opacity: .85; }
.btn-hero-outline { background: transparent; color: var(--text-main); border: 1px solid rgba(255,255,255,0.3); padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: all .2s; display: inline-block; }
.btn-hero-outline:hover { border-color: var(--gold); color: var(--gold); }
.search-bar { display: flex; align-items: center; background: rgba(255,255,255,0.07); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; overflow: hidden; max-width: 900px; }
.search-select { background: transparent; border: none; padding: 14px 16px; color: var(--text-main); font-size: 13px; font-family: var(--font); outline: none; cursor: pointer; flex: 1; }
.search-select option { background: var(--navy-2); }
.search-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.btn-search { background: var(--gold); color: var(--navy); border: none; padding: 14px 24px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: var(--font); white-space: nowrap; transition: opacity .2s; }
.btn-search:hover { opacity: .85; }

.stats-section { background: var(--navy-2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stats-inner { max-width: 1200px; margin: 0 auto; padding: 2rem; display: flex; align-items: center; justify-content: center; }
.stat-item { flex: 1; text-align: center; padding: 1rem; }
.stat-number { font-size: 36px; font-weight: 700; color: var(--gold); }
.stat-label { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
.stat-divider { width: 1px; height: 50px; background: var(--border); flex-shrink: 0; }

.section { padding: 5rem 0; }
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
.section-head.centered { flex-direction: column; align-items: center; text-align: center; gap: .5rem; }
.section-tag { font-size: 12px; color: var(--gold); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: .4rem; }
.section-title { font-size: 30px; font-weight: 700; }
.btn-view-all { color: var(--gold); font-size: 14px; font-weight: 500; }
.btn-view-all:hover { opacity: .7; }

.cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.cat-card { border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); transition: transform .2s, border-color .2s; display: block; }
.cat-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.5); }
.cat-img-wrap { position: relative; height: 160px; }
.cat-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cat-overlay { position: absolute; inset: 0; background: rgba(10,22,40,0.35); }
.cat-body { background: var(--surface); padding: 1rem 1.2rem; display: flex; align-items: center; gap: 10px; }
.cat-icon { font-size: 22px; }
.cat-name { font-size: 16px; font-weight: 600; }
.cat-count { font-size: 12px; color: var(--text-muted); margin-left: auto; }

.prop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.prop-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: transform .2s, border-color .2s; }
.prop-card:hover { transform: translateY(-4px); border-color: rgba(201,168,76,0.4); }
.prop-img-wrap { position: relative; }
.prop-img { width: 100%; height: 180px; object-fit: cover; display: block; }
.prop-cat-badge { position: absolute; top: 10px; left: 10px; background: rgba(10,22,40,0.75); color: var(--text-main); font-size: 11px; padding: 3px 9px; border-radius: 20px; text-transform: capitalize; }
.prop-mode { position: absolute; top: 10px; right: 10px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.prop-mode.sell { background: rgba(201,168,76,0.9); color: var(--navy); }
.prop-mode.rent { background: rgba(127,224,176,0.9); color: var(--navy); }
.prop-price { position: absolute; bottom: 10px; left: 10px; background: var(--navy); color: var(--gold); font-weight: 700; font-size: 14px; padding: 4px 12px; border-radius: 6px; border: 1px solid rgba(201,168,76,0.3); }
.prop-body { padding: 1rem; }
.prop-name { font-weight: 600; font-size: 15px; }
.prop-loc { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
.prop-meta { display: flex; gap: 14px; font-size: 12px; color: var(--text-muted); margin-top: 8px; min-height: 18px; }
.prop-meta.muted { font-style: italic; }
.btn-view { display: block; width: 100%; margin-top: 12px; background: rgba(201,168,76,0.1); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); padding: 9px; border-radius: 7px; font-size: 13px; font-weight: 500; text-align: center; transition: background .2s; }
.btn-view:hover { background: rgba(201,168,76,0.2); }

.arch-section { background: var(--navy-2); padding: 5rem 0; }
.arch-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
.arch-main { position: relative; border-radius: var(--radius); overflow: hidden; min-height: 380px; }
.arch-side { display: flex; flex-direction: column; gap: 16px; }
.arch-small { position: relative; border-radius: var(--radius); overflow: hidden; flex: 1; }
.arch-img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 180px; }
.arch-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem 1.2rem; background: linear-gradient(to top, rgba(10,22,40,0.95), transparent); }
.arch-title { font-weight: 600; font-size: 15px; }
.arch-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 2rem; }
.why-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; text-align: center; transition: border-color .2s; }
.why-card:hover { border-color: rgba(201,168,76,0.4); }
.why-icon { font-size: 32px; margin-bottom: .75rem; }
.why-title { font-size: 15px; font-weight: 600; margin-bottom: .5rem; }
.why-text { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

.cta-section { background: var(--navy-2); border-top: 1px solid var(--border); padding: 5rem 2rem; text-align: center; }
.cta-inner { max-width: 600px; margin: 0 auto; }
.cta-title { font-size: 32px; font-weight: 700; margin-bottom: 1rem; }
.cta-sub { font-size: 15px; color: var(--text-muted); margin-bottom: 2rem; line-height: 1.7; }
</style>
