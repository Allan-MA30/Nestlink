/**
 * USERS STORE
 * Owned by: Auth teammate
 * Used by: Login, Register, PropertySell (to show seller name), AdminDashboard
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref([
    // Demo seller account — for testing
    {
      id: 1,
      name: 'Jean (Demo Seller)',
      email: 'seller@estatehub.com',
      password: 'seller123',
      role: 'seller',
      profilePicture: '',
    },
    // Demo admin account
    {
      id: 2,
      name: 'Admin',
      email: 'admin@estatehub.com',
      password: 'admin123',
      role: 'admin',
      profilePicture: '',
    },
  ])

  function findByEmail(email) {
    return users.value.find(u => u.email === email) || null
  }

  function findById(id) {
    return users.value.find(u => u.id === id) || null
  }

  function addUser(user) {
    users.value.push(user)
  }

  // ✅ Required by AdminDashboard — update any field on a user by id
  function updateUser(id, updates) {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates }
    }
  }

  // ✅ Required by AdminDashboard — remove a user by id
  function removeUser(id) {
    users.value = users.value.filter(u => u.id !== id)
  }

  return { users, findByEmail, findById, addUser, updateUser, removeUser }
})