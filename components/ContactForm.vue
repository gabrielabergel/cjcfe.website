<template>
  <div class="contact-form-wrapper">
    <form @submit.prevent="handleSubmit" class="contact-form">
      <div class="form-field">
        <label for="name">Nom *</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          placeholder="Votre nom"
        />
      </div>

      <div class="form-field">
        <label for="email">Email *</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          placeholder="votre@email.com"
        />
      </div>

      <div class="form-field">
        <label for="phone">Téléphone</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          placeholder="+33 X XX XX XX XX"
        />
      </div>

      <div class="form-field">
        <label for="subject">Sujet</label>
        <input
          type="text"
          id="subject"
          v-model="formData.subject"
          placeholder="Sujet de votre message"
        />
      </div>

      <div class="form-field form-field-full">
        <label for="message">Message *</label>
        <textarea
          id="message"
          v-model="formData.message"
          required
          rows="6"
          placeholder="Votre message..."
        ></textarea>
      </div>

      <!-- Honeypot anti-spam (invisible pour les humains, piège les bots) -->
      <div class="form-field-honeypot" aria-hidden="true">
        <label for="website">Website</label>
        <input
          type="text"
          id="website"
          v-model="formData.honeypot"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <button
        type="submit"
        class="submit-button"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer' }}
      </button>

      <div v-if="submitSuccess" class="success-message">
        Merci ! Votre message a été envoyé.
      </div>

      <div v-if="submitError" class="error-message">
        {{ submitErrorMessage || "Une erreur s'est produite. Veuillez réessayer." }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  honeypot: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)
const submitErrorMessage = ref('')

const handleSubmit = async () => {
  // Anti-spam: si le honeypot est rempli, c'est un bot
  if (formData.honeypot) {
    submitSuccess.value = true
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false
  submitErrorMessage.value = ''

  try {
    const response = await $fetch<{ status: string; errors?: Record<string, string>; message?: string }>('/api/contact', {
      method: 'POST',
      body: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
    })

    if (response.status === 'error') {
      submitError.value = true
      if (response.errors) {
        submitErrorMessage.value = Object.values(response.errors).join(', ')
      } else {
        submitErrorMessage.value = response.message || ''
      }
      return
    }

    submitSuccess.value = true

    // Reset form
    formData.name = ''
    formData.email = ''
    formData.phone = ''
    formData.subject = ''
    formData.message = ''
  } catch (error) {
    console.error('Error submitting form:', error)
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.contact-form-wrapper {
  background-color: var(--white);
  border-radius: 8px;
  padding: var(--40);
}

.contact-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--20);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: var(--blue);
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input,
  textarea {
    padding: var(--15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    transition: all 0.3s ease;
    background-color: #f9f9f9;
    color: var(--blue);

    &::placeholder {
      color: #999;
    }

    &:hover:not(:focus) {
      border-color: var(--beige);
    }

    &:focus {
      outline: none;
      border-color: var(--blue);
      background-color: var(--white);
    }
  }

  textarea {
    resize: vertical;
    min-height: 150px;
  }
}

.form-field-full {
  grid-column: 1 / -1;
}

.submit-button {
  grid-column: 1 / -1;
  padding: var(--15) var(--30);
  border: 2px solid var(--blue);
  border-radius: 100px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: var(--10);
  background-color: var(--blue);
  color: var(--white);

  &:hover:not(:disabled) {
    background-color: var(--beige);
    border-color: var(--beige);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.success-message {
  grid-column: 1 / -1;
  padding: var(--15);
  background-color: rgba(30, 180, 120, 0.1);
  border: 2px solid rgba(30, 180, 120, 0.4);
  border-radius: 8px;
  color: rgb(0, 140, 90);
  text-align: center;
  font-weight: 600;
}

.error-message {
  grid-column: 1 / -1;
  padding: var(--15);
  background-color: rgba(200, 0, 0, 0.1);
  border: 2px solid rgba(200, 0, 0, 0.4);
  border-radius: 8px;
  color: rgb(180, 0, 0);
  text-align: center;
  font-weight: 600;
}

// Honeypot - caché visuellement mais accessible aux bots
.form-field-honeypot {
  position: absolute;
  left: -9999px;
  top: -9999px;
  opacity: 0;
  height: 0;
  width: 0;
  overflow: hidden;
  pointer-events: none;
}

@media (max-width: 767px) {
  .contact-form {
    grid-template-columns: 1fr;
  }

  .contact-form-wrapper {
    padding: 0px;
    width: 100%;
  }
}
</style>
