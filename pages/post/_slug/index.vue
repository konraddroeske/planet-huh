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
  const isMobile = window.$nuxt.$device.isMobile

  const setNavStyle = window.$nuxt.$store._actions.setNavStyle[0]
  setNavStyle(isMobile)
}

const entering = () => {
  // console.log('entering post')
}

const leaving = () => {
  // console.log('leaving post')
}

const leavingToIndex = () => {
  const setNavContainerLarge =
    window.$nuxt.$store._actions.setNavContainerLarge[0]
  setNavContainerLarge()

  // const isMobile = window.$nuxt.$device.isMobile

  const setNavLarge = window.$nuxt.$store._actions.setNavLarge[0]
  setNavLarge()
}

export default {
  layout: 'default',
  components: { HeroBanner, RichText, ArtistCredits, SocialShare },
  transition(to, from) {
    // http://localhost:3000/post/bambii-lorem-ipsum

    if (!from) {
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
      this.$router.push({
        path: `/`,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
