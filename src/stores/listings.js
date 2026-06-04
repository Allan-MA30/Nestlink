/**
 * LISTINGS STORE
 * Owned by: Seller teammate (Jean / team leader)
 *
 * This is the single source of truth for ALL properties.
 * - Buy teammate:  filter by mode === 'sell'
 * - Rent teammate: filter by mode === 'rent'
 * - Sell/Dashboard: full access (add, edit, remove)
 *
 * Currency: Rwandan Franc (RWF)
 * Use the exported formatRWF() helper everywhere you display a price.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/** Format a number as Rwandan Francs, e.g. formatRWF(180000) → "RWF 180,000" */
export function formatRWF(amount, { suffix = '' } = {}) {
  if (amount == null) return '—'
  return 'RWF ' + Number(amount).toLocaleString() + (suffix ? suffix : '')
}

export const useListingsStore = defineStore('listings', () => {
  // STATE
  const properties = ref([
    // ---- HOUSES ----
    {
      id: 1,
      title: 'Kacyiru Heights Villa',
      category: 'house',
      type: 'Villa',
      price: 180000,
      mode: 'sell',
      location: 'Kacyiru, Kigali',
      bedrooms: 4,
      bathrooms: 3,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      description: 'Spacious villa with garden and parking in a quiet neighborhood.',
      sellerId: 1,
      status: 'active',
      views: 412,
      createdAt: '2025-01-10',
    },
    {
      id: 2,
      title: 'Nyarutarama Apartment 3B',
      category: 'house',
      type: 'Apartment',
      price: 95000,
      mode: 'sell',
      location: 'Nyarutarama, Kigali',
      bedrooms: 3,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      description: 'Modern apartment with city views on the 3rd floor.',
      sellerId: 1,
      status: 'active',
      views: 287,
      createdAt: '2025-02-05',
    },
    {
      id: 3,
      title: 'Kimihurura Studio',
      category: 'house',
      type: 'Studio',
      price: 600,
      mode: 'rent',
      location: 'Kimihurura, Kigali',
      bedrooms: 1,
      bathrooms: 1,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      description: 'Cozy studio apartment, ideal for a single professional.',
      sellerId: 1,
      status: 'active',
      views: 193,
      createdAt: '2025-03-12',
    },
    {
      id: 4,
      title: 'Gisozi Family Home',
      category: 'house',
      type: 'House',
      price: 1200,
      mode: 'rent',
      location: 'Gisozi, Kigali',
      bedrooms: 4,
      bathrooms: 2,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      description: 'Spacious family home with large yard, available for rent.',
      sellerId: 1,
      status: 'active',
      views: 310,
      createdAt: '2025-02-20',
    },

    // ---- LAND ----
    {
      id: 5,
      title: 'Rebero Plot — 10 Acres',
      category: 'land',
      type: 'Agricultural Land',
      price: 45000,
      mode: 'sell',
      location: 'Rebero, Kigali',
      bedrooms: null,
      bathrooms: null,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
      description: 'Fertile agricultural land perfect for farming or development.',
      sellerId: 1,
      status: 'active',
      views: 198,
      createdAt: '2025-03-01',
    },
    {
      id: 6,
      title: 'Kicukiro Commercial Plot',
      category: 'land',
      type: 'Commercial Land',
      price: 120000,
      mode: 'sell',
      location: 'Kicukiro, Kigali',
      bedrooms: null,
      bathrooms: null,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
      description: 'Prime commercial plot in a fast-growing business district.',
      sellerId: 1,
      status: 'active',
      views: 254,
      createdAt: '2025-01-28',
    },
    {
      id: 7,
      title: 'Bugesera Residential Plot',
      category: 'land',
      type: 'Residential Land',
      price: 800,
      mode: 'rent',
      location: 'Bugesera, Eastern Province',
      bedrooms: null,
      bathrooms: null,
      image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400',
      description: 'Residential plot available for long-term lease.',
      sellerId: 1,
      status: 'active',
      views: 142,
      createdAt: '2025-04-05',
    },

    // ---- CARS ----
    {
      id: 8,
      title: 'Toyota Land Cruiser 2020',
      category: 'car',
      type: 'SUV',
      price: 55000,
      mode: 'sell',
      location: 'Kigali',
      bedrooms: null,
      bathrooms: null,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
      description: 'Well maintained Land Cruiser, full service history, low mileage.',
      sellerId: 1,
      status: 'active',
      views: 521,
      createdAt: '2025-02-14',
    },
    {
      id: 9,
      title: 'Honda CRV 2019',
      category: 'car',
      type: 'SUV',
      price: 28000,
      mode: 'sell',
      location: 'Kigali',
      bedrooms: null,
      bathrooms: null,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400',
      description: 'Clean Honda CRV, accident free, ready for transfer.',
      sellerId: 1,
      status: 'active',
      views: 389,
      createdAt: '2025-03-08',
    },
    {
      id: 10,
      title: 'Toyota Corolla 2018 — Hire',
      category: 'car',
      type: 'Sedan',
      price: 80,
      mode: 'rent',
      location: 'Kigali',
      bedrooms: null,
      bathrooms: null,
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
      description: 'Daily car hire. Clean, fuel efficient Toyota Corolla.',
      sellerId: 1,
      status: 'active',
      views: 267,
      createdAt: '2025-04-01',
    },
    {
      id: 11,
      title: 'Mercedes Sprinter Van — Hire',
      category: 'car',
      type: 'Van',
      price: 150,
      mode: 'rent',
      location: 'Kigali',
      bedrooms: null,
      bathrooms: null,
      image: 'https://images.unsplash.com/photo-1566008885218-90422e143f97?w=400',
      description: 'Spacious van available for daily or weekly hire. Driver optional.',
      sellerId: 1,
      status: 'active',
      views: 183,
      createdAt: '2025-04-10',
    },
  ])

  // GETTERS
  const forSale    = computed(() => properties.value.filter(p => p.mode === 'sell'))
  const forRent    = computed(() => properties.value.filter(p => p.mode === 'rent'))
  const myListings = (sellerId) => properties.value.filter(p => p.sellerId === sellerId)

  // ACTIONS
  function addListing(listing) {
    const newListing = {
      ...listing,
      id: Date.now(),
      views: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    }
    properties.value.push(newListing)
  }

  function updateListing(id, updates) {
    const index = properties.value.findIndex(p => p.id === id)
    if (index !== -1) {
      properties.value[index] = { ...properties.value[index], ...updates }
    }
  }

  function removeListing(id) {
    properties.value = properties.value.filter(p => p.id !== id)
  }

  function incrementViews(id) {
    const prop = properties.value.find(p => p.id === id)
    if (prop) prop.views++
  }

  return {
    properties,
    forSale,
    forRent,
    myListings,
    addListing,
    updateListing,
    removeListing,
    incrementViews,
  }
})