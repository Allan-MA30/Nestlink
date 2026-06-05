<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <RouterView />
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'

const auth     = useAuthStore()
const route    = useRoute()
const settings = useAppSettingsStore()

// ✅ Hide Navbar & Footer for sellers AND admins — both have their own top-bars
const showNavbar = computed(() => !auth.isSeller && !auth.isAdmin)
const showFooter = computed(() => !auth.isSeller && !auth.isAdmin)

const originalText  = new WeakMap()
const originalAttrs = new WeakMap()
let observer    = null
let translating = false

function translateTextNode(node) {
  if (!originalText.has(node)) originalText.set(node, node.textContent)
  const original = originalText.get(node)
  if (settings.language === 'en') {
    if (!settings.isTranslatedText(original)) node.textContent = original
    return
  }
  node.textContent = settings.translateText(original)
}

function translateElementAttrs(el) {
  const attrs = ['placeholder', 'title', 'aria-label', 'alt', 'value']
  let saved = originalAttrs.get(el)
  if (!saved) { saved = {}; originalAttrs.set(el, saved) }
  attrs.forEach((attr) => {
    if (!el.hasAttribute(attr)) return
    if (!saved[attr]) saved[attr] = el.getAttribute(attr)
    if (settings.language === 'en') {
      if (!settings.isTranslatedText(saved[attr])) el.setAttribute(attr, saved[attr])
      return
    }
    el.setAttribute(attr, settings.translateText(saved[attr]))
  })
}

function walkAndTranslate(root = document.body) {
  if (!root || translating) return
  translating = true
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes  = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  nodes.forEach((node) => {
    if (!node.textContent || !node.textContent.trim()) return
    const parent = node.parentElement
    if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName)) return
    translateTextNode(node)
  })
  root.querySelectorAll?.('input, textarea, img, button, a, [title], [aria-label]').forEach(translateElementAttrs)
  translating = false
}

function scheduleTranslation() {
  nextTick(() => window.requestAnimationFrame(() => walkAndTranslate()))
}

onMounted(() => {
  scheduleTranslation()
  observer = new MutationObserver(() => scheduleTranslation())
  observer.observe(document.body, {
    childList: true, subtree: true, characterData: true, attributes: true,
    attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'value'],
  })
})

onBeforeUnmount(() => { observer?.disconnect() })

watch(() => settings.language, scheduleTranslation)
watch(() => route.fullPath,    scheduleTranslation)
watch(() => auth.user, () => {
  settings.applyTheme()
  scheduleTranslation()
}, { deep: true })
</script>