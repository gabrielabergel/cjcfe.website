export const useReveal = () => {
  const initReveal = () => {
    if (typeof window === 'undefined') return

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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    // Observer les éléments avec la classe .reveal
    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return observer
  }

  onMounted(() => {
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(initReveal, 100)
  })
}
