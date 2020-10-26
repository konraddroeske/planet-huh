<template>
  <div>
    <CTA />
    <CategoryNav variant="gradient" />
    <FeaturedCollabs :posts="featured" />
    <PostsFeed
      :posts="postsTotal"
      :post-limit="postLimit"
      get-some-posts-path="homepage/getSomePosts"
    />
    <Footer />
  </div>
</template>

<script>
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import CTA from "@/components/CTA"
import FeaturedCollabs from "@/components/FeaturedCollabs"
import CategoryNav from "@/components/CategoryNav"
import PostsFeed from "@/components/PostsFeed"
import Footer from "@/components/Footer"

gsap.registerPlugin(ScrollToPlugin)

export default {
  layout: "default",
  components: {
    CTA,
    FeaturedCollabs,
    CategoryNav,
    PostsFeed,
    Footer,
  },
  async fetch({ store }) {
    if (store.state.homepage.postsFeed.length === 0) {
      await store.dispatch("homepage/getHomepage")
      await store.commit("homepage/resetMaxPosts")
      await store.dispatch("homepage/getSomePosts", 16)
    }
  },

  computed: {
    isMobile() {
      return this.$device.isMobileOrTablet
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
    featured() {
      return this.$store.state.homepage.featured
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
      if (this.isMobile) {
        gsap.to(window, 0.4, {
          scrollTo: 0,
          ease: "power4.out",
        })
        this.$store.commit("transitions/setNavOpen", true)
      }
    },
    onDestroy() {
      if (this.isMobile && this.isOpen) {
        // and scroll is locked
        this.$store.commit("transitions/setNavOpen", false)
      }
    },
  },

  transition: {
    leave(el, done) {
      const isNavLarge = this.$store.state.transitions.isNavLarge

      if (isNavLarge) {
        this.$store.dispatch("transitions/setNavLeave", done)
      }

      if (!isNavLarge) {
        this.$store.dispatch("transitions/setNavLeaveSmall", { done, el })
      }
    },
    enter(el, done) {
      this.$store.dispatch("transitions/setNavContainerLarge", el)
      this.$store.dispatch("transitions/setNavLarge", el)
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
