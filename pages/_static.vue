<template>
  <div v-if="page">
    <RichText :content="page.content" />
  </div>
</template>

<script>
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import RichText from "@/components/RichText"

gsap.registerPlugin(ScrollToPlugin)

const setNav = () => {
  const isMobile = window.$nuxt.$device.isMobile

  const setNavStyle = window.$nuxt.$store._actions.setNavStyle[0]
  setNavStyle(isMobile)
}

const entering = () => {
  // console.log('entering post')
}

const leaving = () => {
  // console.log('leaving post')
}

const leavingToIndex = () => {
  const setNavContainerLarge =
    window.$nuxt.$store._actions.setNavContainerLarge[0]
  setNavContainerLarge()

  const setNavLarge = window.$nuxt.$store._actions.setNavLarge[0]
  setNavLarge()
}
export default {
  layout: "default",
  components: {
    RichText,
  },
  transition: {
    enter(el, done) {
      this.$store.dispatch("setEnter", { el, done })
    },
    leave(el, done) {
      this.$store.dispatch("setLeave", { el, done })
    },
  },
  data() {
    return {
      staticSlug: this.$route.params.static,
    }
  },
  computed: {
    page() {
      return this.$store.state.static.staticPages[this.staticSlug]
    },
  },
  watch: {
    $route(to, from) {
      if (from.path === "/") {
        entering()
      }

      to.path === "/" ? leavingToIndex(to.matched[0].instances) : leaving()
    },
  },
  async created() {
    if (!this.$store.state.static.staticPages[this.staticSlug]) {
      await this.$store.dispatch("static/getStaticPage", this.staticSlug)
    }
  },
  mounted() {
    if (!this.$store.state.isMounted) {
      setNav()
      this.$store.commit("toggleMounted")
    }
  },
  // beforeDestroy() {
  //   this.onDestroy()
  // },
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
</script>

<style></style>
