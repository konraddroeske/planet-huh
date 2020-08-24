<template>
  <div class="categories">
    <CategoryHero :title="title" />
    <PostsFeed
      :posts="posts"
      get-some-posts-path="categories/getCategoryPosts"
    />
  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import CategoryHero from '@/components/CategoryHero'
import PostsFeed from '@/components/PostsFeed'

gsap.registerPlugin(ScrollToPlugin)

const setNav = () => {
  const isMobile = window.$nuxt.$device.isMobile

  const setNavStyle = window.$nuxt.$store._actions.setNavStyle[0]
  setNavStyle(isMobile)
}

const entering = () => {
  console.log('entering categories')
}

const leaving = () => {
  console.log('leaving categories')
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
  transition(to, from) {
    if (!from) {
      return setNav()
    }

    if (from.path === '/') {
      entering()
    }

    to.path === '/' ? leavingToIndex() : leaving()
  },
  components: {
    CategoryHero,
    PostsFeed,
  },
  computed: {
    title() {
      return this.$store.state.categories.title
    },
    posts() {
      return this.$store.state.categories.postsFeed
    },
  },
  mounted() {
    // get posts
    this.$store.dispatch(
      'categories/handlePosts',
      Object.values(this.$route.query)[0]
    )

    this.onHeroLoad()

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
    onHeroLoad() {
      this.$store.dispatch('setNavContainerSmall')
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
