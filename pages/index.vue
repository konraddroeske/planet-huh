<template>
  <div>
    <CTA />
    <CategoryNav variant="gradient" />
    <FeaturedCollabs />
    <PostsFeed />
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
    afterEnter(el, done) {
      console.log('enter index')
    },
    leave(el, done) {
      console.log('leaving index')

      const navContainer = document.querySelector('#navContainer')
      const navContainerTl = gsap.timeline()
      const scrollTime = 0.3
      const navTime = 1
      const isMobile = this.$device.isMobile

      navContainerTl
        .to(window, scrollTime, {
          scrollTo: 0,
          onComplete: () => {
            done()
          },
        })
        .set('#layout', {
          height: 'calc(100vh + 1px)',
          overflow: 'hidden',
        })
        .set(navContainer, {
          position: 'fixed',
        })
        .set('#sceneContainer', {
          width: '250%',
        })
        .to(navContainer, navTime, {
          y: '-2rem',
          scale: isMobile ? 0.2 : 0.15,
          ease: 'power4.out',
        })
        .set('#layout', {
          height: 'auto',
          overflow: 'visible',
        })

      gsap.to('#toggleContainer', navTime, { autoAlpha: 0 })
      gsap.to('#welcome', navTime, { autoAlpha: 0 })
      gsap.to('#navFeedContainer', navTime, { autoAlpha: 0 })
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
