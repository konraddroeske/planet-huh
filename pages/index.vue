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
import CTA from '@/components/CTA'
import FeaturedCollabs from '@/components/FeaturedCollabs'
import CategoryNav from '@/components/CategoryNav'
import PostsFeed from '@/components/PostsFeed'

export default {
  layout: 'default',
  transition: {
    css: false,
    mode: 'out-in',
    leave(el, done) {
      console.log('leave')

      const sceneContainer = document.querySelector('#sceneContainer')
      const sceneContainerTl = gsap.timeline()
      const navTime = 2.5

      sceneContainerTl
        .set(sceneContainer, {
          position: 'fixed',
          transform: 'translate(0, 0)',
          top: 'auto',
          left: 'auto',
          right: 0,
          bottom: '-30vh',
          zIndex: 100,
        })
        .to(sceneContainer, navTime, {
          width: '150px',
          bottom: 0,
          right: 0,
          ease: 'power4.out',
        })

      const scene = document.querySelector('#scene')
      const sceneTl = gsap.timeline()

      sceneTl.set(scene, { minHeight: 0 }).to(scene, navTime, {
        height: '175px',
        ease: 'power4.out',
      })

      const toggle = document.querySelector('#toggleContainer')
      const toggleTl = gsap.timeline()
      const fadeTime = 0.5

      toggleTl.to(toggle, fadeTime, { autoAlpha: 0 })

      gsap.to(el, fadeTime, {
        opacity: 0,
        onComplete: done,
      })

      gsap.set('#footer', {
        autoAlpha: 0,
      })
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
  bottom: 4rem;
  right: 4rem;
  z-index: 10000;
}
</style>
