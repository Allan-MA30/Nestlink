<template>
  <div class="my-own-page">
    <section class="my-own-hero">
      <div>
        <span class="section-tag">Viewer Space</span>
        <h1>My Own</h1>
        <p>Track the products you asked about and read seller responses.</p>
      </div>
    </section>

    <main class="my-own-inner">
      <div class="tabs">
        <button :class="{ active: activeTab === 'notifications' }" @click="activeTab = 'notifications'">
          Notifications
          <span v-if="unreadResponses.length">{{ unreadResponses.length }}</span>
        </button>
        <button :class="{ active: activeTab === 'owned' }" @click="activeTab = 'owned'">
          Owned
          <span>{{ myEnquiries.length }}</span>
        </button>
      </div>

      <section v-if="activeTab === 'notifications'" class="panel">
        <div v-if="responses.length === 0" class="empty-state">
          <h2>No seller responses yet</h2>
          <p>When a seller answers your enquiry, it will appear here immediately.</p>
        </div>

        <div v-else class="item-list">
          <article v-for="enquiry in responses" :key="'response-' + enquiry.id" class="response-card" :class="{ unread: !enquiry.responseRead }">
            <div class="item-head">
              <div>
                <h2>{{ enquiry.propertyTitle || enquiry.subject || 'General enquiry' }}</h2>
                <p>{{ enquiry.repliedAt || enquiry.createdAt }}</p>
              </div>
              <span v-if="!enquiry.responseRead" class="new-pill">New</span>
            </div>
            <div class="message-block">
              <strong>Your message</strong>
              <p>{{ enquiry.message }}</p>
            </div>
            <div class="reply-block">
              <strong>Seller response</strong>
              <p>{{ enquiry.reply }}</p>
            </div>
            <button v-if="!enquiry.responseRead" class="btn-primary" @click="enquiries.markResponseRead(enquiry.id)">
              Mark as read
            </button>
          </article>
        </div>
      </section>

      <section v-else class="panel">
        <div v-if="myEnquiries.length === 0" class="empty-state">
          <h2>No owned enquiries yet</h2>
          <p>After you enquire on a property or vehicle, it will be listed here.</p>
        </div>

        <div v-else class="item-list">
          <article v-for="enquiry in myEnquiries" :key="'owned-' + enquiry.id" class="owned-card">
            <img v-if="listingFor(enquiry)?.image" :src="listingFor(enquiry).image" :alt="enquiry.propertyTitle" />
            <div class="owned-body">
              <div class="item-head">
                <div>
                  <h2>{{ enquiry.propertyTitle || enquiry.subject || 'General enquiry' }}</h2>
                  <p>{{ enquiry.createdAt }}</p>
                </div>
                <span class="status-pill">{{ enquiry.reply ? 'Answered' : 'Waiting' }}</span>
              </div>
              <p class="owned-message">{{ enquiry.message }}</p>
              <div class="owned-meta">
                <span v-if="listingFor(enquiry)">{{ listingFor(enquiry).location }}</span>
                <span v-if="listingFor(enquiry)">{{ formatPrice(listingFor(enquiry)) }}</span>
                <span>{{ enquiry.fromEmail }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEnquiriesStore } from '@/stores/enquiries'
import { useListingsStore, formatRWF } from '@/stores/listings'

const auth = useAuthStore()
const enquiries = useEnquiriesStore()
const listings = useListingsStore()
const activeTab = ref('notifications')

const myEnquiries = computed(() =>
  enquiries.enquiries.filter(e =>
    e.viewerId === auth.user?.id || (!e.viewerId && e.fromEmail === auth.user?.email)
  ).sort((a, b) => b.id - a.id)
)

const responses = computed(() => myEnquiries.value.filter(e => e.reply))
const unreadResponses = computed(() => responses.value.filter(e => !e.responseRead))

function listingFor(enquiry) {
  return listings.properties.find(p => p.id === enquiry.propertyId)
}

function formatPrice(property) {
  if (property.mode === 'rent') {
    return formatRWF(property.price, { suffix: property.category === 'car' ? '/day' : '/mo' })
  }
  return formatRWF(property.price)
}
</script>

<style scoped>
.my-own-page { min-height: 100vh; background: var(--navy); }
.my-own-hero { background: linear-gradient(135deg, var(--navy-3), var(--navy)); border-bottom: 1px solid var(--border); padding: 4rem 2rem; }
.my-own-hero > div { max-width: 1100px; margin: 0 auto; }
.section-tag { color: var(--gold); font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
.my-own-hero h1 { font-size: 42px; margin: .5rem 0; }
.my-own-hero p { color: var(--text-muted); }
.my-own-inner { max-width: 1100px; margin: 0 auto; padding: 2rem; }
.tabs { display: flex; gap: 10px; margin-bottom: 1.5rem; }
.tabs button { background: var(--surface); color: var(--text-muted); border: 1px solid var(--border); border-radius: 8px; padding: 10px 16px; font-family: var(--font); cursor: pointer; display: flex; align-items: center; gap: 8px; }
.tabs button.active { color: var(--gold); border-color: rgba(201,168,76,0.45); background: rgba(201,168,76,0.1); }
.tabs span, .new-pill, .status-pill { border-radius: 999px; padding: 2px 8px; font-size: 11px; font-weight: 700; }
.tabs span, .new-pill { background: var(--gold); color: var(--navy); }
.status-pill { background: rgba(111,186,255,0.12); color: #6fbaff; border: 1px solid rgba(111,186,255,0.25); }
.panel { min-height: 360px; }
.item-list { display: grid; gap: 14px; }
.response-card, .owned-card, .empty-state { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; }
.response-card.unread { border-color: rgba(201,168,76,0.55); background: rgba(201,168,76,0.05); }
.item-head { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.item-head h2 { font-size: 17px; }
.item-head p { color: var(--text-muted); font-size: 12px; margin-top: 3px; }
.message-block, .reply-block { border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 13px; line-height: 1.6; }
.message-block { background: rgba(10,22,40,0.35); border-left: 3px solid var(--gold); }
.reply-block { background: rgba(127,224,176,0.08); border-left: 3px solid #7fe0b0; }
.message-block p, .reply-block p, .owned-message, .empty-state p { color: var(--text-muted); margin-top: 4px; }
.owned-card { display: grid; grid-template-columns: 180px 1fr; gap: 1rem; padding: 0; overflow: hidden; }
.owned-card img { width: 100%; height: 100%; min-height: 160px; object-fit: cover; }
.owned-body { padding: 1rem; }
.owned-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.owned-meta span { color: var(--text-muted); border: 1px solid var(--border); border-radius: 999px; padding: 4px 9px; font-size: 12px; }
.empty-state { text-align: center; padding: 4rem 2rem; }
.empty-state h2 { margin-bottom: .5rem; }
@media (max-width: 700px) {
  .owned-card { grid-template-columns: 1fr; }
  .owned-card img { height: 190px; }
  .item-head { flex-direction: column; }
}
</style>
