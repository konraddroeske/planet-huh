<template>
  <div>
    <HeroBanner v-if="post" v-bind="post" :city="'Toronto'" />
    <RichText v-if="post" :content="post.content" />
  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
import RichText from '@/components/RichText'

gsap.registerPlugin(ScrollToPlugin)

const setNav = () => {
  console.log('set Nav')

  const navContainer = document.querySelector('#navContainer')
  const toggle = document.querySelector('#toggleContainer')

  gsap.set(navContainer, {
    position: 'fixed',
    y: '-2rem',
    scale: 0.15,
  })

  gsap.set('#nav3d', {
    height: 0,
  })

  gsap.set(toggle, { autoAlpha: 0 })
}

const entering = () => {
  console.log('entering')
}

const leaving = () => {
  console.log('leaving')
}

const leavingToIndex = () => {
  gsap.to('#nav3d', 0.6, {
    height: '100vh',
    ease: 'power4.out',
  })

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
}

export default {
  layout: 'default',
  transition(to, from) {
    if (!from) {
      // set 3D nav to small

      return setNav()
    }

    if (to.path === '/') {
      leavingToIndex()
    }

    if (from.path === '/') {
      entering()
    }
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
