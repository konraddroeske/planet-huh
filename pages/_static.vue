<template>
  <div v-if="page" class="container">
    <Wrapper>
      <h1>{{ page.title }}</h1>
    </Wrapper>
    <RichText :content="page.content" />
  </div>
</template>

<script>
import { mapState } from "vuex"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import RichText from "@/components/RichText"
import Wrapper from "@/components/Wrapper"

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
    Wrapper,
  },
  async fetch() {
    const staticSlug = this.$route.params.static
    if (!this.$store.state.static.staticPages[staticSlug]) {
      await this.$store.dispatch("static/getStaticPage", staticSlug)
    }
  },
  data() {
    return {
      staticSlug: this.$route.params.static,
      increment: 0,
    }
  },
  computed: {
    ...mapState({
      validSlugs: (state) => state.static.slugs,
    }),
    page() {
      return this.$store.state.static.staticPages[this.staticSlug]
    },
  },
  watch: {
    // Redirects to error page if static page not found (fallback behaviour)
    validSlugs(newSlugs) {
      const slugNotFound = !newSlugs.some(
        (slug) => slug.slug === this.staticSlug
      )
      if (slugNotFound) return this.$nuxt.error({ statusCode: 404 })
    },
    $route(to, from) {
      if (from.path === "/") {
        entering()
      }

      to.path === "/" ? leavingToIndex(to.matched[0].instances) : leaving()
    },
  },
  transition: {
    enter(el, done) {
      this.$store.dispatch("setEnter", { el, done })
      this.$store.dispatch("setNavContainerSmall")
    },
    leave(el, done) {
      this.$store.dispatch("setLeave", { el, done })
    },
  },
  mounted() {
    if (!this.$store.state.isMounted) {
      setNav()
      this.$store.commit("toggleMounted")
    }
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
</script>

<style lang="scss" scoped>
.container {
  padding-top: 4rem;
  padding-bottom: 2rem;

  @media (min-width: $bp-desktop) {
    padding-bottom: 2rem;
  }
}
h1 {
  text-align: center;
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 2.25rem;
  margin-top: 2rem;

  @media (min-width: $bp-desktop) {
    font-size: 3.5rem;
    margin-top: 6rem;
  }
}
</style>
