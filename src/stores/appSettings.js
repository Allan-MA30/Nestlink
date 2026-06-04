import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const THEME_KEY = 'estate_theme'
const LANGUAGE_KEY = 'estate_language'

const translations = {
  'Rwanda\'s #1 Marketplace': 'Isoko rya mbere mu Rwanda',
  'Buy, Sell or Rent': 'Gura, Gurisha cyangwa Kodesha',
  'Houses, Land & Cars': 'Amazu, Ibibanza n\'Imodoka',
  'Find houses, land plots, and vehicles across Rwanda.': 'Shaka amazu, ibibanza n\'imodoka mu Rwanda hose.',
  'Trusted sellers. Thousands of listings. Simple process.': 'Abagurisha bizewe. Amatangazo menshi. Uburyo bworoshye.',
  'Browse Listings': 'Reba amatangazo',
  'Browse Rentals': 'Reba ibikodeshwa',
  'All Categories': 'Ibyiciro byose',
  'Houses': 'Amazu',
  'Land': 'Ibibanza',
  'Cars': 'Imodoka',
  'Buy': 'Gura',
  'For Sale': 'Bigurishwa',
  'For Rent': 'Bikodeshwa',
  'For Rent / Hire': 'Bikodeshwa',
  'All Locations': 'Ahantu hose',
  'Any Price': 'Igiciro icyo ari cyo cyose',
  'Search': 'Shaka',
  'Active Listings': 'Amatangazo akora',
  'Houses & Apartments': 'Amazu n\'amafurati',
  'Land Plots': 'Ibibanza',
  'Vehicles': 'Imodoka',
  'What are you looking for?': 'Urashaka iki?',
  'Browse by Category': 'Shakisha hakurikijwe icyiciro',
  'Featured': 'Byatoranyijwe',
  'Latest Listings': 'Amatangazo mashya',
  'View All': 'Reba byose',
  'Premium Listings in Rwanda': 'Amatangazo meza mu Rwanda',
  'Why NestLink': 'Kuki NestLink',
  'The Smarter Way to Buy, Sell & Rent': 'Uburyo bwiza bwo kugura, kugurisha no gukodesha',
  'Ready to List Your Property or Vehicle?': 'Witeguye gushyira umutungo cyangwa imodoka yawe ku isoko?',
  'Get Started as a Seller': 'Tangira nk\'ugurisha',
  'Log in to view details': 'Injira urebe ibisobanuro',
  'View Listing': 'Reba itangazo',
  'Log in to View': 'Injira urebe',
  'Easy Search': 'Gushakisha byoroshye',
  'Verified Sellers': 'Abagurisha bemejwe',
  'Direct Enquiries': 'Ubutumwa butaziguye',
  'Seller Dashboard': 'Akanama k\'ugurisha',

  'Home': 'Ahabanza',
  'Property': 'Imitungo',
  'Contacts': 'Twandikire',
  'Login': 'Injira',
  'Register': 'Iyandikishe',
  'Logout': 'Sohoka',
  'Dashboard': 'Akanama',
  'Seller': 'Uguruisha',
  'Viewer': 'Ureba',
  'Admin': 'Umuyobozi',
  'My Own': 'Ibyanjye',
  'Notifications': 'Amamenyesha',
  'Owned': 'Ibyasabwe',
  'Light': 'Urumuri',
  'Black': 'Umukara',
  'English': 'Icyongereza',
  'Kinyarwanda': 'Ikinyarwanda',

  'Create an account': 'Fungura konti',
  'Register to list or browse properties': 'Iyandikishe ushyireho cyangwa urebe imitungo',
  'Full name': 'Amazina yose',
  'Email': 'Imeyili',
  'Password': 'Ijambo ry\'ibanga',
  'Choose a password': 'Hitamo ijambo ry\'ibanga',
  'Profile picture (optional)': 'Ifoto y\'umwirondoro (si ngombwa)',
  'Change photo': 'Hindura ifoto',
  'Choose photo': 'Hitamo ifoto',
  'Account type': 'Ubwoko bwa konti',
  'Admin key': 'Urufunguzo rw\'umuyobozi',
  'Terms and conditions': 'Amategeko n\'amabwiriza',
  'Create account': 'Fungura konti',
  'Sign in': 'Injira',
  'Welcome back': 'Murakaza neza nanone',
  'Sign in to your account to continue': 'Injira muri konti yawe ukomeze',
  'Sign in as': 'Injira nka',
  'Enter your password': 'Andika ijambo ry\'ibanga',
  'Please complete all fields.': 'Uzuza imyanya yose.',
  'Password must be at least 7 characters.': 'Ijambo ry\'ibanga rigomba kugira nibura inyuguti 7.',
  'Email already registered.': 'Iyi meyili isanzwe yanditswe.',
  'Invalid admin key.': 'Urufunguzo rw\'umuyobozi si rwo.',
  'Please provide email and password.': 'Tanga imeyili n\'ijambo ry\'ibanga.',
  'No account found. Please register first.': 'Nta konti yabonetse. Banza wiyandikishe.',
  'Password incorrect.': 'Ijambo ry\'ibanga si ryo.',

  'Find Your Perfect Rental Property': 'Shaka umutungo ukodeshwa ukunogeye',
  'Browse apartments, houses, villas and offices across Rwanda.': 'Reba amafurati, amazu, amavilla n\'ibiro mu Rwanda hose.',
  'Search by location...': 'Shakisha ahantu...',
  'Featured Properties': 'Imitungo yatoranyijwe',
  'Discover our handpicked selection of premium rentals': 'Reba ibikodeshwa byiza twaguhitiyemo',
  'Property Types': 'Ubwoko bw\'imitungo',
  'Why Choose Us?': 'Kuki waduhitamo?',
  'Ready To Find Your Next Home?': 'Witeguye kubona inzu yawe ikurikira?',
  'Browse & Enquire': 'Reba kandi ubaze',
  'Log in to Browse': 'Injira urebe',
  'Enquire Now': 'Baza nonaha',
  'Log in to Enquire': 'Injira ubaze',
  'Rental Enquiry Form': 'Ifishi yo kubaza ku bukode',
  'Enquiry Form': 'Ifishi y\'ubutumwa',
  'Your name': 'Amazina yawe',
  'Your email': 'Imeyili yawe',
  'Phone number': 'Nimero ya telefoni',
  'Date needed': 'Itariki ubyifuza',
  'Message': 'Ubutumwa',
  'Cancel': 'Hagarika',
  'Send Enquiry': 'Ohereza ikibazo',
  'Enquiry sent successfully!': 'Ikibazo cyoherejwe neza!',
  'Please fill in your name, email, and message.': 'Uzuza amazina, imeyili n\'ubutumwa.',

  'Get in Touch': 'Twandikire',
  'Have questions about our properties? We\'d love to hear from you.': 'Ufite ibibazo ku mitungo yacu? Twishimiye kukumva.',
  'About NestLink': 'Ibyerekeye NestLink',
  'Our Mission': 'Intego yacu',
  'Contact Information': 'Amakuru yo kutwandikira',
  'Address': 'Aderesi',
  'Phone': 'Telefoni',
  'Business Hours': 'Amasaha y\'akazi',
  'Send us a Message': 'Twandikire ubutumwa',
  'Full Name *': 'Amazina yose *',
  'Email Address *': 'Imeyili *',
  'Phone Number (Optional)': 'Telefoni (si ngombwa)',
  'Subject *': 'Impamvu *',
  'What is this about?': 'Ni iki kijyanye n\'ubu butumwa?',
  'Tell us your message...': 'Twandikire ubutumwa bwawe...',
  'Send Message': 'Ohereza ubutumwa',
  'Sending...': 'Birimo koherezwa...',
  'Name is required': 'Amazina arakenewe',
  'Email is required': 'Imeyili irakenewe',
  'Subject is required': 'Impamvu irakenewe',
  'Message is required': 'Ubutumwa burakenewe',
  'Please enter a valid email address': 'Andika imeyili nyayo',
  'Please fix the errors above': 'Kosora amakosa ari hejuru',

  'Welcome back,': 'Murakaza neza nanone,',
  'Here\'s your selling overview': 'Dore ishusho y\'ibyo ugurisha',
  'Total Views': 'Ababirebye bose',
  'Enquiries': 'Ibibazo',
  'Sold / Rented': 'Byagurishijwe / Byakodeshejwe',
  'Quick Actions': 'Ibikorwa byihuse',
  'Add New Listing': 'Ongeraho itangazo rishya',
  'View Bookings': 'Reba ubusabe',
  'Check Notifications': 'Reba amamenyesha',
  'Settings': 'Igenamiterere',
  'Overview': 'Incamake',
  'My Listings': 'Amatangazo yanjye',
  'No enquiries yet': 'Nta bibazo biraza',
  'Reply Now': 'Subiza nonaha',
  'Update Response': 'Hindura igisubizo',
  'Mark as Read': 'Shyira ko byasomwe',
  'Mark all read': 'Shyira byose ko byasomwe',
  'Your response:': 'Igisubizo cyawe:',
  'Write your response to this viewer...': 'Andikira uyu ureba igisubizo...',
  'Please write a response before sending.': 'Banza wandike igisubizo mbere yo kohereza.',
  'New enquiry from': 'Ikibazo gishya cya',
  'Enquiry from': 'Ikibazo cya',
  'Profile Settings': 'Igenamiterere ry\'umwirondoro',
  'Save Changes': 'Bika impinduka',

  'My Listed Properties': 'Imitungo nashyizeho',
  'properties listed': 'imitungo yashyizweho',
  'properties available': 'imitungo ihari',
  'Sellers only': 'Abagurisha gusa',
  'This Page Is For Sellers And Property Lenders': 'Uru rupapuro ni urw\'abagurisha n\'abakodesha imitungo',
  'Register as a seller to start managing listings from your dashboard.': 'Iyandikishe nk\'ugurisha utangire gucunga amatangazo yawe kuri dashboard.',
  'Register as a Seller': 'Iyandikishe nk\'ugurisha',
  'You have uploaded nothing': 'Nta kintu urashyiraho',
  'Start by listing your first property to reach buyers across Rwanda.': 'Tangira ushyiraho umutungo wawe wa mbere kugira ngo ugere ku baguzi mu Rwanda hose.',
  '+ Add Your First Listing': '+ Ongeraho itangazo rya mbere',
  'Edit in Dashboard': 'Hindurira kuri dashboard',
  'Properties For Sale': 'Imitungo igurishwa',
  'No properties available': 'Nta mitungo ihari',
  'Check back soon for new listings.': 'Garuka vuba urebe amatangazo mashya.',
  'Listed by:': 'Byashyizweho na:',
  'Your listing': 'Itangazo ryawe',
  'Seller email': 'Imeyili y\'ugurisha',
  'I am interested in this listing. Is it still available?': 'Nshishikajwe n\'iri tangazo. Riracyahari?',
  'I am interested in renting this property. Is it still available?': 'Nshishikajwe no gukodesha uyu mutungo. Uracyahari?',
  'Bed': 'Icyumba',
  'Bath': 'Ubwiherero',
  'beds': 'ibyumba',
  'baths': 'ubwiherero',
  'views': 'abarebye',

  'Admin — User Management': 'Umuyobozi — Gucunga abakoresha',
  'Admin â€” User Management': 'Umuyobozi — Gucunga abakoresha',
  'Manage registered users': 'Cunga abakoresha biyandikishije',
  'shown': 'berekanywe',
  'total': 'bose',
  'Search by name or email': 'Shakisha ukoresheje amazina cyangwa imeyili',
  'All roles': 'Inshingano zose',
  'Add user': 'Ongeraho ukoresha',
  'Close': 'Funga',
  'Create': 'Rema',
  'Actions': 'Ibikorwa',
  'Reset PW': 'Hindura ijambo ry\'ibanga',
  'Delete': 'Siba',
  'No users match your criteria.': 'Nta bakoresha bahuye n\'ibyo washakishije.',
  'Password updated': 'Ijambo ry\'ibanga ryahinduwe',
  'Set new password for': 'Shyiraho ijambo ry\'ibanga rishya rya',

  'Viewer Space': 'Umwanya w\'ureba',
  'Track the products you asked about and read seller responses.': 'Kurikirana ibyo wabajijeho kandi usome ibisubizo by\'abagurisha.',
  'No seller responses yet': 'Nta bisubizo by\'abagurisha biraza',
  'When a seller answers your enquiry, it will appear here immediately.': 'Uguruisha nasubiza ikibazo cyawe, bizahita bigaragara hano.',
  'No owned enquiries yet': 'Nta bibazo byawe biraza',
  'After you enquire on a property or vehicle, it will be listed here.': 'Nyuma yo kubaza ku mutungo cyangwa imodoka, bizagaragara hano.',
  'Your message': 'Ubutumwa bwawe',
  'Seller response': 'Igisubizo cy\'ugurisha',
  'Mark as read': 'Shyira ko cyasomwe',
  'Answered': 'Byasubijwe',
  'Waiting': 'Birategereje',
  'New': 'Gishya',
}

const wordTranslations = {
  'Listings': 'Amatangazo',
  'Listing': 'Itangazo',
  'Properties': 'Imitungo',
  'Property': 'Umutungo',
  'Locations': 'Ahantu',
  'Support': 'Ubufasha',
  'Price': 'Igiciro',
  'Category': 'Icyiciro',
  'Location': 'Ahantu',
  'Type': 'Ubwoko',
  'Name': 'Amazina',
  'Role': 'Uruhare',
  'Status': 'Imiterere',
  'Active': 'Gikora',
  'Pending': 'Gitegereje',
  'Sold': 'Cyagurishijwe',
  'Rented': 'Cyakodeshejwe',
  'Remove': 'Kuraho',
  'Delete': 'Siba',
  'Edit': 'Hindura',
  'View': 'Reba',
  'Reply': 'Subiza',
  'Replied': 'Byasubijwe',
  'Title': 'Umutwe',
  'Description': 'Ibisobanuro',
  'Bedrooms': 'Ibyumba',
  'Bathrooms': 'Ubwiherero',
  'Seller': 'Uguruisha',
  'Buyer': 'Ugura',
  'Lendee': 'Ukodesha',
  'From': 'Guhera',
  'Under': 'Munsi ya',
  'available': 'ihari',
  'listed': 'yashyizweho',
  'only': 'gusa',
}

const sortedPhrases = Object.entries(translations).sort((a, b) => b[0].length - a[0].length)
const translatedValues = new Set([
  ...Object.values(translations),
  ...Object.values(wordTranslations),
])

function storedValue(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export const useAppSettingsStore = defineStore('appSettings', () => {
  const theme = ref(storedValue(THEME_KEY, 'dark'))
  const language = ref(storedValue(LANGUAGE_KEY, 'en'))

  function applyTheme(value = theme.value) {
    document.documentElement.dataset.theme = value
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function toggleLanguage() {
    language.value = language.value === 'en' ? 'rw' : 'en'
  }

  function t(en, rw) {
    return language.value === 'rw' ? rw : en
  }

  function translateText(text) {
    if (language.value !== 'rw' || !text) return text
    const leading = text.match(/^\s*/)?.[0] || ''
    const trailing = text.match(/\s*$/)?.[0] || ''
    let body = text.trim()
    if (!body) return text
    if (translations[body]) return leading + translations[body] + trailing
    for (const [en, rw] of sortedPhrases) {
      body = body.replaceAll(en, rw)
    }
    for (const [en, rw] of Object.entries(wordTranslations)) {
      body = body.replace(new RegExp(`\\b${en}\\b`, 'g'), rw)
    }
    body = body
      .replace(/(\d+)\s+properties listed/gi, '$1 imitungo yashyizweho')
      .replace(/(\d+)\s+properties available/gi, '$1 imitungo ihari')
      .replace(/(\d+)\s+views/gi, '$1 abarebye')
      .replace(/(\d+)\s+beds/gi, '$1 ibyumba')
      .replace(/(\d+)\s+baths/gi, '$1 ubwiherero')
      .replace(/Listed by:/gi, 'Byashyizweho na:')
      .replace(/Seller email/gi, 'Imeyili y\'ugurisha')
    return leading + body + trailing
  }

  function isTranslatedText(text) {
    return translatedValues.has((text || '').trim())
  }

  watch(theme, (value) => {
    localStorage.setItem(THEME_KEY, value)
    applyTheme(value)
  }, { immediate: true })

  watch(language, (value) => {
    localStorage.setItem(LANGUAGE_KEY, value)
  }, { immediate: true })

  return { theme, language, applyTheme, toggleTheme, toggleLanguage, t, translateText, isTranslatedText }
})
