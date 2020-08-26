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
import { mapState } from 'vuex'
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

const leavingToIndex = (el) => {
  const setNavContainerLarge =
    window.$nuxt.$store._actions.setNavContainerLarge[0]
  setNavContainerLarge()

  const setNavLarge = window.$nuxt.$store._actions.setNavLarge[0]
  setNavLarge(el)
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

    to.path === '/'
      ? leavingToIndex(to.matched[0].instances.default.$el)
      : leaving()
  },
  components: {
    CategoryHero,
    PostsFeed,
  },
  computed: mapState({
    title: (state) => state.categories.title,
    posts: (state) => state.categories.postsFeed,
  }),
  async created() {
    await this.$store.dispatch('categories/handleQueries', this.$route.query)
  },
  mounted() {
    this.onHeroLoad()
    this.onMount()
  },
  beforeDestroy() {
    this.onDestroy()
  },
  activated() {
    this.$store.dispatch('categories/handleQueries', this.$route.query)

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
