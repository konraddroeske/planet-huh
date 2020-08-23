<template>
  <div>
    <CTA />
    <CategoryNav variant="gradient" />
    <FeaturedCollabs />
    <PostsFeed :posts="posts" get-some-posts-path="homepage/getSomePosts" />
  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import CTA from '@/components/CTA'
import FeaturedCollabs from '@/components/FeaturedCollabs'
import CategoryNav from '@/components/CategoryNav'
import PostsFeed from '@/components/PostsFeed'

gsap.registerPlugin(ScrollToPlugin)

export default {
  layout: 'default',
  components: {
    CTA,
    FeaturedCollabs,
    CategoryNav,
    PostsFeed,
  },
  async fetch({ store }) {
    await store.dispatch('homepage/getHomepage')
    await store.dispatch('homepage/getSomePosts', 4)
  },
  transition: {
    leave(el, done) {
      console.log('leaving index')

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
  },
  computed: {
    isMobile() {
      return this.$device.isMobile
    },
    isOpen() {
      return this.$store.state.isOpen
    },
    posts() {
      return this.$store.state.homepage.postsFeed
    },
  },
  mounted() {
    if (this.isMobile) {
      this.$store.commit('setNavOpen', true)
    }
  },
  beforeDestroy() {
    if (this.isMobile && this.isOpen) {
      // and scroll is locked
      this.$store.commit('setNavOpen', false)
    }
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
