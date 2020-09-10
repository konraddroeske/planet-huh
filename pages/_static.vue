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
import RichText from "@/components/RichText"
import Wrapper from "@/components/Wrapper"

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
  },
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
  head() {
    return {
      title: `Planet Huh${this.page?.title ? " | " + this.page?.title : ""}`,
      meta: [
        {
          hid: "og:title",
          property: "og:title",
          content: this.page?.title,
        },
      ],
    }
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
