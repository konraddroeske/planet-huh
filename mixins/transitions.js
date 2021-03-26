export default {
  transition: {
    enter(el, done) {
      this.$store.dispatch("transitions/setEnter", { el, done })
      this.$store.dispatch("transitions/setNavContainerSmall")
    },
    leave(el, done) {
      this.$store.dispatch("transitions/setLeave", { el, done })
    },
  },
  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },
  methods: {
    onMount() {
      const nav = document.querySelector("#navContainer")
      nav.addEventListener("click", this.route, {
        passive: true,
      })
      nav.addEventListener("touchstart", this.route, {
        passive: true,
      })
    },
    onDestroy() {
      const nav = document.querySelector("#navContainer")
      nav.removeEventListener("click", this.route)
      nav.removeEventListener("touchstart", this.route)
    },
    route() {
      this.$router.push({
        path: `/`,
      })
    },
  },
}
