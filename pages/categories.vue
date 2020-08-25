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
  // console.log('entering categories')
}

const leaving = () => {
  // console.log('leaving categories')
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
  async created() {
    const routeParams = Object.values(this.$route.query)[0]

    if (this.$store.state.categories.filters[0] !== routeParams[0]) {
      await this.$store.dispatch('categories/handlePosts', routeParams)
    }
  },
  mounted() {
    this.onHeroLoad()
    this.onMount()
  },
  beforeDestroy() {
    this.onDestroy()
  },
  activated() {
    const routeParams = Object.values(this.$route.query)[0]

    if (this.$store.state.categories.filters[0] !== routeParams[0]) {
      this.$store.dispatch('categories/handlePosts', routeParams)
    }

    setTimeout(() => {
      this.onHeroLoad()
    }, 300)

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
