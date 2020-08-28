<template>
  <div v-if="post">
    <HeroBanner v-if="post.artist.length === 1" v-bind="post" />
    <CollabBanner
      v-if="post.artist.length > 1"
      v-bind="post"
      :headline="'Presented by Red Bull'"
    />
    <RichText :content="post.content" />
    <ArtistCredits :artists="post.artist" />
    <SocialShare :title="post.title" :link="link" />
    <SuggestedPosts
      :city="{ name: post.city[0].name, filterType: 'exclude' }"
      :sense="{ name: post.sense[0].name, filterType: 'exclude' }"
      :mood="{ name: post.mood.mood, filterType: 'exclude' }"
    />
  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
import CollabBanner from '@/components/CollabBanner'
import RichText from '@/components/RichText'
import ArtistCredits from '@/components/ArtistCredits'
import SocialShare from '@/components/SocialShare'
import SuggestedPosts from '@/components/SuggestedPosts'

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

  const setNavLarge = window.$nuxt.$store._actions.setNavLarge[0]
  setNavLarge()
}

export default {
  layout: 'default',
  components: {
    HeroBanner,
    CollabBanner,
    RichText,
    ArtistCredits,
    SocialShare,
    SuggestedPosts,
  },
  transition(to, from) {
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
        sense {
          name
        }
        mood {
          moodCategory
          mood
        }
        artist {
          name
          location
          about
          website
          social
          socialUrl
        }
        city {
          name
        }
      }
    }`)

    const { coverImage, content } = data.data.post

    this.post = {
      ...data.data.post,
      imageSrc: coverImage.url,
      content: content.raw.children,
    }
  },
  mounted() {
    this.onMount()
  },
  beforeDestroy() {
    this.onDestroy()
  },
  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },
  methods: {
    onMount() {
      const nav = document.querySelector('#navContainer')
      nav.addEventListener('click', this.route, false)
      nav.addEventListener('touchstart', this.route, false)
    },
    onDestroy() {
      const nav = document.querySelector('#navContainer')
      nav.removeEventListener('click', this.route, false)
      nav.removeEventListener('touchstart', this.route, false)
    },
    route() {
      this.$router.push({
        path: `/`,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
