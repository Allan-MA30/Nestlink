/**
 * ENQUIRIES STORE
 * Owned by: Seller teammate
 *
 * Stores messages sent by buyers/renters to sellers.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEnquiriesStore = defineStore('enquiries', () => {
  const enquiries = ref([
    {
      id: 1,
      fromName: 'Amina Uwase',
      fromEmail: 'amina@email.com',
      propertyId: 1,
      propertyTitle: 'Kacyiru Heights Villa',
      message: 'Is the price negotiable? We would like to schedule a viewing this weekend.',
      read: false,
      viewerId: null,
      reply: '',
      repliedAt: '',
      responseRead: true,
      createdAt: '2025-06-02',
    },
    {
      id: 2,
      fromName: 'Patrick Habimana',
      fromEmail: 'patrick@email.com',
      propertyId: 3,
      propertyTitle: 'Gisozi Family Home',
      message: 'Does it include a garage? Also what is the land size?',
      read: false,
      viewerId: null,
      reply: '',
      repliedAt: '',
      responseRead: true,
      createdAt: '2025-06-01',
    },
  ])

  function sendEnquiry(enquiry) {
    enquiries.value.push({
      ...enquiry,
      id: Date.now(),
      read: false,
      reply: '',
      repliedAt: '',
      responseRead: true,
    })
  }

  function markRead(id) {
    const e = enquiries.value.find(e => e.id === id)
    if (e) e.read = true
  }

  function replyToEnquiry(id, reply) {
    const e = enquiries.value.find(e => e.id === id)
    if (!e) return
    e.reply = reply
    e.repliedAt = new Date().toISOString().split('T')[0]
    e.responseRead = false
    e.read = true
  }

  function markResponseRead(id) {
    const e = enquiries.value.find(e => e.id === id)
    if (e) e.responseRead = true
  }

  const unreadCount = () => enquiries.value.filter(e => !e.read).length

  return { enquiries, sendEnquiry, markRead, replyToEnquiry, markResponseRead, unreadCount }
})
