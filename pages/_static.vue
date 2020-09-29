<template>
  <div>
    <div v-if="page" class="container">
      <Wrapper>
        <h1>{{ page.title }}</h1>
      </Wrapper>
      <RichText :content="page.content" />
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapState } from "vuex"
import RichText from "@/components/RichText"
import Wrapper from "@/components/Wrapper"
import Footer from "@/components/Footer"

export default {
  layout: "default",
  components: {
    RichText,
    Wrapper,
    Footer,
  },
  data() {
    return {
      slug: this.$route.params.static,
    }
  },
  computed: {
    ...mapState({
      pages: (state) => state.static.pages,
    }),
    page() {
      const page = this.pages.find((el) => el.slug === this.slug)
      const { content } = page

      return {
        ...page,
        content: content.raw.children,
      }
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
          content: `Planet Huh${
            this.page?.title ? " | " + this.page?.title : ""
          }`,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: `Planet Huh${
            this.page?.title ? " | " + this.page?.title : ""
          }`,
        },
        {
          hid: "og:site_name",
          property: "og:site_name",
          content: `Planet Huh${
            this.page?.title ? " | " + this.page?.title : ""
          }`,
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `http://www.planethuh.com${this.$route.fullPath}`,
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
