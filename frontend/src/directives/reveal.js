const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      )
    : null

export default {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value && binding.value.delay) {
      el.style.setProperty('--reveal-delay', `${binding.value.delay}ms`)
    }
    if (!observer) {
      el.classList.add('is-visible')
      return
    }
    observer.observe(el)
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  },
}
