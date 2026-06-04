<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <RouterLink to="/" class="footer-brand">
        <span class="brand-mark">EH</span>
        <span>Estate<span>Hub</span></span>
      </RouterLink>

      <nav class="footer-links">
        <RouterLink to="/">{{ settings.t('Home', 'Ahabanza') }}</RouterLink>
        <RouterLink to="/property/buy">{{ settings.t('Buy', 'Gura') }}</RouterLink>
        <RouterLink to="/property/sell">{{ settings.t('Sell', 'Gurisha') }}</RouterLink>
        <RouterLink to="/property/rent">{{ settings.t('Rent', 'Kodesha') }}</RouterLink>
        <RouterLink to="/contacts">{{ settings.t('Contacts', 'Twandikire') }}</RouterLink>
        <RouterLink v-if="auth.isViewer" to="/my-own">My Own</RouterLink>
        <RouterLink v-if="!auth.isLoggedIn" to="/login">{{ settings.t('Login', 'Injira') }}</RouterLink>
        <RouterLink v-if="!auth.isLoggedIn" to="/register">{{ settings.t('Register', 'Iyandikishe') }}</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin">Admin</RouterLink>
      </nav>

      <div class="footer-actions">
        <button type="button" @click="settings.toggleTheme()">
          {{ settings.theme === 'dark' ? settings.t('Light', 'Urumuri') : settings.t('Black', 'Umukara') }}
        </button>
        <button type="button" @click="settings.toggleLanguage()">
          {{ settings.language === 'en' ? 'Kinyarwanda' : 'English' }}
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useAppSettingsStore } from '@/stores/appSettings'

const auth = useAuthStore()
const settings = useAppSettingsStore()
</script>

<style scoped>
.site-footer { background: var(--navy-2); border-top: 1px solid var(--border); padding: 1.5rem 2rem; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: auto 1fr auto; gap: 1.5rem; align-items: center; }
.footer-brand { display: flex; align-items: center; gap: 10px; color: var(--text-main); font-weight: 800; }
.footer-brand span span { color: var(--gold); }
.brand-mark { width: 34px; height: 34px; border-radius: 8px; background: var(--gold); color: var(--navy); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; }
.footer-links { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.footer-links a { color: var(--text-muted); font-size: 13px; padding: 6px 9px; border-radius: 6px; }
.footer-links a:hover { color: var(--gold); background: var(--card); }
.footer-actions { display: flex; gap: 8px; }
.footer-actions button { background: transparent; color: var(--text-muted); border: 1px solid var(--border); border-radius: 7px; padding: 7px 10px; font-family: var(--font); cursor: pointer; }
.footer-actions button:hover { color: var(--gold); border-color: var(--gold); }
@media (max-width: 820px) {
  .footer-inner { grid-template-columns: 1fr; text-align: center; }
  .footer-brand, .footer-actions { justify-content: center; }
}
</style>
