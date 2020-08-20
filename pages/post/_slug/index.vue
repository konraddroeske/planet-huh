<template>
  <div v-if="post">
    <HeroBanner v-bind="post" :city="'Toronto'" />
    <RichText :content="post.content" />
    <ArtistCredits :artists="[post.artist]" />
    <SocialShare :title="post.title" :link="link" />
  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
import RichText from '@/components/RichText'
import ArtistCredits from '@/components/ArtistCredits'
import SocialShare from '@/components/SocialShare'

gsap.registerPlugin(ScrollToPlugin)

const setNav = () => {
  console.log('set Nav')
  const isMobile = window.$nuxt.$device.isMobile

  gsap.set('#navContainer', {
    position: 'fixed',
    y: '-2rem',
    scale: isMobile ? 0.2 : 0.15,
  })

  gsap.set('#nav3d', {
    height: 0,
  })

  gsap.set('#toggleContainer', { autoAlpha: 0 })
  gsap.set('#welcome', { autoAlpha: 0 })
  gsap.set('#sceneContainer', {
    width: '250%',
  })
}

const entering = () => {
  console.log('entering post')
}

const leaving = () => {
  console.log('leaving post')
}

const leavingToIndex = () => {
  gsap.to('#nav3d', 0.6, {
    height: '100vh',
    ease: 'power4.out',
  })

  const isMobile = window.$nuxt.$device.isMobile
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
      position: isMobile ? 'fixed' : 'absolute',
    })
    .set('#layout', {
      height: 'auto',
      overflow: 'visible',
    })
    .set('#sceneContainer', {
      width: '100%',
    })

  gsap.to('#toggleContainer', navTime, { autoAlpha: 1 })
  gsap.to('#welcome', navTime, { autoAlpha: 1 })
}

export default {
  layout: 'default',
  components: { HeroBanner, RichText, ArtistCredits, SocialShare },
  transition(to, from) {
    // http://localhost:3000/post/bambii-lorem-ipsum

    if (!from) {
      // set nav to small
      return setNav()
    }

    if (from.path === '/') {
      entering()
    }

    to.path === '/' ? leavingToIndex() : leaving()
  },
  data() {
    return {
      slug: this.$route.params.slug,
      post: null,
    }
  },
  computed: {
    link() {
      const host = this.req ? this.req.headers.host : window.location.origin
      return `${host}${this.$route.path}`
    },
  },
  async created() {
    const { data } = await fetchContent(`{
      post(where: {slug: "${this.slug}"}) {
        title
        excerpt
        date
        content {
          html
          markdown
          raw
          text
        }
        coverImage {
          url
        }
        sense
        mood
        artist {
          name
          about
          website
          social
          socialUrl
        }
      }
    }`)

    this.post = {
      ...data.data.post,
      imageSrc: data.data.post.coverImage.url,
      content: data.data.post.content.raw.children,
    }
  },
  mounted() {
    const nav = document.querySelector('#navContainer')
    nav.addEventListener('click', this.route, false)
    nav.addEventListener('touchstart', this.route, false)
  },
  beforeDestroy() {
    const nav = document.querySelector('#navContainer')
    nav.removeEventListener('click', this.route, false)
    nav.removeEventListener('touchstart', this.route, false)
  },
  methods: {
    route() {
      console.log('touch')

      this.$router.push({
        path: `/`,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
