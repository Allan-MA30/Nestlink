import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])

  function addNotification(message, type = 'info') {
    notifications.value.unshift({
      id: Date.now(),
      message,
      type,
      read: false,
      createdAt: new Date()
    })
  }

  function markAsRead(id) {
    const n = notifications.value.find(item => item.id === id)
    if (n) n.read = true
  }

  const unreadCount = computed(
    () => notifications.value.filter(n => !n.read).length
  )

  return {
    notifications,
    addNotification,
    markAsRead,
    unreadCount
  }
})