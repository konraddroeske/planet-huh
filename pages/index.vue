<template>
  <div>
    <CTA />
    <CategoryNav variant="gradient" />
    <FeaturedCollabs />
    <PostsFeed
      :posts="postsTotal"
      :post-limit="postLimit"
      get-some-posts-path="homepage/getSomePosts"
    />
  </div>
</template>

<script>
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import CTA from "@/components/CTA"
import FeaturedCollabs from "@/components/FeaturedCollabs"
import CategoryNav from "@/components/CategoryNav"
import PostsFeed from "@/components/PostsFeed"

gsap.registerPlugin(ScrollToPlugin)

export default {
  layout: "default",
  components: {
    CTA,
    FeaturedCollabs,
    CategoryNav,
    PostsFeed,
  },
  async fetch({ store }) {
    if (store.state.homepage.postsFeed.length === 0) {
      await store.dispatch("homepage/getHomepage")
      await store.dispatch("homepage/getFeatured")
      await store.commit("homepage/resetMaxPosts")
      await store.dispatch("homepage/getSomePosts", 8)
    }
  },
  transition: {
    leave(el, done) {
      const isNavLarge = window.$nuxt.$store.state.isNavLarge

      if (isNavLarge) {
        const setNavIndex = window.$nuxt.$store._actions.setNavIndex[0]
        setNavIndex(done)
      }

      if (!isNavLarge) {
        const setNavIndexSmall =
          window.$nuxt.$store._actions.setNavIndexSmall[0]
        setNavIndexSmall([done, el])
      }
    },
    enter(el, done) {
      const setNavContainerLarge =
        window.$nuxt.$store._actions.setNavContainerLarge[0]
      setNavContainerLarge()

      const setNavLarge = window.$nuxt.$store._actions.setNavLarge[0]
      setNavLarge()
    },
  },
  computed: {
    isMobile() {
      return this.$device.isMobile
    },
    isOpen() {
      return this.$store.state.isOpen
    },
    postLimit() {
      return this.$store.getters["homepage/postLimit"]
    },
    postsTotal() {
      return this.$store.getters["homepage/postsTotal"]
    },
  },
  // mounted() {
  //   this.onMount()
  // },
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
      this.$store.commit("toggleMounted")

      if (this.isMobile) {
        this.$store.commit("setNavOpen", true)
      }
    },
    onDestroy() {
      if (this.isMobile && this.isOpen) {
        // and scroll is locked
        this.$store.commit("setNavOpen", false)
      }
    },
  },
}
</script>

<style>
.testLink {
  width: 150px;
  position: fixed;
  bottom: 5rem;
  right: 4rem;
  z-index: 10000;
}
</style>
