<template>
  <div class="contacts-wrapper">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Get in Touch</h1>
      <p>Have questions about our properties? We'd love to hear from you.</p>
    </section>

    <div class="contacts-container">
      <!-- Contact Info & About -->
      <div class="left-section">
        <!-- About Us -->
        <div class="about-card">
          <h2>About NestLink</h2>
          <p>
            NestLink is Rwanda's premier real estate marketplace, connecting buyers, sellers, and renters with their perfect properties. We're committed to making real estate transactions transparent, secure, and accessible to everyone.
          </p>
          <div class="mission">
            <h3>Our Mission</h3>
            <p>To revolutionize how people buy, sell, and rent properties in Rwanda by providing a trusted, user-friendly platform.</p>
          </div>
        </div>

        <!-- Contact Details -->
        <div class="contact-details">
          <h3>Contact Information</h3>
          <div class="detail-item">
            <span class="icon">📍</span>
            <div>
              <strong>Address</strong>
              <p>Kigali, Rwanda</p>
            </div>
          </div>
          <div class="detail-item">
            <span class="icon">📧</span>
            <div>
              <strong>Email</strong>
              <p><a href="mailto:info@nestlink.rw">info@nestlink.rw</a></p>
            </div>
          </div>
          <div class="detail-item">
            <span class="icon">📱</span>
            <div>
              <strong>Phone</strong>
              <p><a href="tel:+250123456789">+250 (123) 456 789</a></p>
            </div>
          </div>
          <div class="detail-item">
            <span class="icon">⏰</span>
            <div>
              <strong>Business Hours</strong>
              <p>Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="right-section">
        <div class="form-card">
          <h2>Send us a Message</h2>
          
          <form @submit.prevent="submitForm">
            <!-- Name Field -->
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Your full name"
                @blur="validateField('name')"
              />
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your.email@example.com"
                @blur="validateField('email')"
              />
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>

            <!-- Phone Field (Optional) -->
            <div class="form-group">
              <label for="phone">Phone Number (Optional)</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+250 700 000 000"
              />
            </div>

            <!-- Subject Field -->
            <div class="form-group">
              <label for="subject">Subject *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                placeholder="What is this about?"
                @blur="validateField('subject')"
              />
              <span v-if="errors.subject" class="error-text">{{ errors.subject }}</span>
            </div>

            <!-- Message Field -->
            <div class="form-group">
              <label for="message">Message *</label>
              <textarea
                id="message"
                v-model="form.message"
                placeholder="Tell us your message..."
                rows="5"
                @blur="validateField('message')"
              ></textarea>
              <span v-if="errors.message" class="error-text">{{ errors.message }}</span>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="successMessage" class="success-message">
              ✓ {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="error-message">
              ✗ {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn-submit"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useEnquiriesStore } from '@/stores/enquiries'
import { useAuthStore } from '@/stores/auth'

const enquiries = useEnquiriesStore()
const auth = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const validateField = (field) => {
  errors[field] = ''

  if (field === 'name') {
    if (!form.name.trim()) {
      errors.name = 'Name is required'
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
  }

  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(form.email)) {
      errors.email = 'Please enter a valid email address'
    }
  }

  if (field === 'subject') {
    if (!form.subject.trim()) {
      errors.subject = 'Subject is required'
    } else if (form.subject.trim().length < 3) {
      errors.subject = 'Subject must be at least 3 characters'
    }
  }

  if (field === 'message') {
    if (!form.message.trim()) {
      errors.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }
  }
}

const submitForm = async () => {
  // Validate all fields
  validateField('name')
  validateField('email')
  validateField('subject')
  validateField('message')

  // Check if there are any errors
  if (Object.values(errors).some(error => error !== '')) {
    errorMessage.value = 'Please fix the errors above'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Save enquiry to store
    enquiries.sendEnquiry({
      fromName: form.name,
      fromEmail: form.email,
      viewerId: auth.user?.role === 'viewer' ? auth.user.id : null,
      subject: form.subject,
      message: form.message,
      phone: form.phone || null,
      createdAt: new Date().toISOString().split('T')[0],
    })

    // Show success message
    successMessage.value = 'Thank you! We\'ve received your message and will get back to you soon.'

    // Reset form
    form.name = ''
    form.email = ''
    form.phone = ''
    form.subject = ''
    form.message = ''

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    errorMessage.value = 'Failed to send message. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contacts-wrapper {
  min-height: 100vh;
  background: var(--navy);
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--navy-3) 0%, var(--navy) 100%);
  padding: 4rem 2rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.hero p {
  font-size: 1.1rem;
  color: var(--text-muted);
}

/* Main Container */
.contacts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
}

/* Left Section */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-card,
.contact-details {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
}

.about-card h2,
.contact-details h3 {
  color: var(--gold);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.about-card p {
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.mission {
  background: rgba(26, 48, 96, 0.5);
  border-left: 3px solid var(--gold);
  padding: 1.5rem;
  border-radius: 6px;
  margin-top: 1.5rem;
}

.mission h3 {
  color: var(--gold);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.mission p {
  color: var(--text-muted);
  line-height: 1.6;
}

/* Contact Details */
.detail-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item .icon {
  font-size: 1.5rem;
  min-width: 2rem;
}

.detail-item strong {
  display: block;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.detail-item p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.detail-item a {
  color: var(--gold);
  transition: opacity 0.2s;
}

.detail-item a:hover {
  opacity: 0.8;
}

/* Right Section - Form */
.right-section {
  display: flex;
  justify-content: center;
}

.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

.form-card h2 {
  color: var(--gold);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: var(--text-main);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  background: rgba(10, 22, 40, 0.5);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.75rem;
  color: var(--text-main);
  font-family: var(--font);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
}

.error-text {
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Messages */
.success-message {
  background: rgba(51, 153, 102, 0.2);
  border: 1px solid #33996644;
  border-radius: 6px;
  padding: 1rem;
  color: #66cc99;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.error-message {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid #ff6b6b44;
  border-radius: 6px;
  padding: 1rem;
  color: #ff9999;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* Submit Button */
.btn-submit {
  width: 100%;
  background: var(--gold);
  color: var(--navy);
  border: none;
  padding: 0.85rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.85;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contacts-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .hero p {
    font-size: 1rem;
  }
}
</style>
