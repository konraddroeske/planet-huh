<template>
  <div>
    <!-- <div class="testLink">
      <nuxt-link :to="`/post/bambii-lorem-ipsum/`" class="postLink">
        Bambi
      </nuxt-link>
    </div> -->
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
  transition: {
    leave(el, done) {
      console.log('leaving index')

      const navContainer = document.querySelector('#navContainer')
      const navContainerTl = gsap.timeline()
      const scrollTime = 0.3
      const navTime = 1

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
        .to(navContainer, navTime, {
          y: '-2rem',
          scale: 0.15,
          ease: 'power4.out',
        })
        .set('#layout', {
          height: 'auto',
          overflow: 'visible',
        })

      const toggle = document.querySelector('#toggleContainer')
      const toggleTl = gsap.timeline()
      toggleTl.to(toggle, navTime, { autoAlpha: 0 })
    },
  },
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
