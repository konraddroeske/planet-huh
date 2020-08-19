<template>
  <div>
    <div class="testLink">
      <nuxt-link :to="`/post/bambii-lorem-ipsum/`" class="postLink">
        Bambi
      </nuxt-link>
    </div>
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

const entering = () => {
  const navContainer = document.querySelector('#navContainer')
  const navContainerTl = gsap.timeline()
  const scrollTime = 0.3
  const navTime = 1
  const delay = 0.2
  navContainerTl
    .to(window, scrollTime, {
      scrollTo: 0,
    })
    .set('#layout', {
      height: 'calc(100vh + 1px)',
      overflow: 'hidden',
    })
    .to(navContainer, navTime, {
      delay,
      y: '0',
      scale: 1,
      ease: 'power4.out',
    })
    .set(navContainer, {
      position: 'absolute',
    })
    .set('#layout', {
      height: 'auto',
      overflow: 'visible',
    })

  const toggle = document.querySelector('#toggleContainer')
  const toggleTl = gsap.timeline()
  toggleTl.to(toggle, navTime, { autoAlpha: 1, delay })
}

const leaving = () => {
  const navContainer = document.querySelector('#navContainer')
  const navContainerTl = gsap.timeline()
  const scrollTime = 0.3
  const navTime = 1
  navContainerTl
    .to(window, scrollTime, {
      scrollTo: 0,
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
}

export default {
  layout: 'default',
  transition(to, from) {
    if (!from) {
      return
    }
    return to.path < from.path ? entering() : leaving()
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
