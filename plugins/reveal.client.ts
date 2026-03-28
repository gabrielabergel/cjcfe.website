export default defineNuxtPlugin((nuxtApp) => {
  const initReveal = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '-100px 0px -100px 0px',
      }
    )

    // Sélectionner les sections et éléments à animer
    const selectors = [
      'section',
      '.page-hero_content',
      '.hero_content',
      '.list_line',
      '.article_item',
      '.article_card_link',
      '.layout_row',
      '.article_row',
      '.block-texte',
      '.block-titre',
      '.block-image',
      '.contact-form-section',
      '.membres-banner_item',
      '.featured',
      '.gazette',
      '.dons',
      '.prieres',
      '.deces',
      // Textes
      'h1',
      'h2',
      'h3',
      'p',
      '.btn',
      '.footer_nav a',
      '.footer_legal a',
    ]

    const elements = document.querySelectorAll(selectors.join(', '))

    elements.forEach((el) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('is-visible')) {
        const rect = el.getBoundingClientRect()
        // Si l'élément est déjà visible dans le viewport au chargement, l'afficher directement
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
          el.classList.add('reveal')
          el.classList.add('is-visible')
        } else {
          // Sinon, le préparer pour l'animation au scroll
          el.classList.add('reveal')
          observer.observe(el)
        }
      }
    })
  }

  // Utiliser le hook Vue app:mounted
  nuxtApp.hook('app:mounted', () => {
    setTimeout(initReveal, 200)
  })

  // Initialiser après chaque navigation
  nuxtApp.hook('page:finish', () => {
    setTimeout(initReveal, 200)
  })
})
