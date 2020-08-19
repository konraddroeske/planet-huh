<template>
  <div>
    <HeroBanner v-if="post" v-bind="post" :city="'Toronto'" />
    <RichText v-if="post" :content="post.content" />
  </div>
</template>

<script>
import gsap from 'gsap'
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
import RichText from '@/components/RichText'
export default {
  layout: 'default',
  transition: {
    css: false,
    mode: 'out-in',
    beforeEnter(el) {
      gsap.set(el, {
        opacity: 0,
      })

      // gsap.set('#footer', { autoAlpha: 0 })
    },
    enter(el, done) {
      const time = 4
      const delay = 0

      const navContainer = document.querySelector('#navContainer')
      const navContainerTl = gsap.timeline()
      navContainerTl.to(navContainer, time, {
        height: 0,
        ease: 'power4.out',
        delay,
      })

      gsap.to(el, time, {
        opacity: 1,
        delay,
        onComplete: done,
      })

      gsap.to('#footer', time, { delay: 2, autoAlpha: 1 })
    },
  },
  components: { HeroBanner, RichText },
  data() {
    return {
      slug: this.$route.params.slug,
      post: null,
    }
  },
  async created() {
    const { data } = await fetchContent(`{
      post(where: {slug: "${this.slug}"}) {
        content {
          html
          markdown
          raw
          text
        }
        coverImage {
          url
        }
        date
        excerpt
        mood
        sense
        title
      }
    }`)

    this.post = {
      ...data.data.post,
      imageSrc: data.data.post.coverImage.url,
      content: data.data.post.content.raw.children,
    }
  },
}
</script>

<style lang="scss" scoped></style>
