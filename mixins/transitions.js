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
      nav.addEventListener("click", this.route, false)
      nav.addEventListener("touchstart", this.route, false)
    },
    onDestroy() {
      const nav = document.querySelector("#navContainer")
      nav.removeEventListener("click", this.route, false)
      nav.removeEventListener("touchstart", this.route, false)
    },
    route() {
      this.$router.push({
        path: `/`,
      })
    },
  },
}
