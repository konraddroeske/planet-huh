<template>
  <div class="cities">
    <CategoryHero :title="title" />
  </div>
</template>

<script>
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import CategoryHero from '@/components/CategoryHero.vue'

gsap.registerPlugin(ScrollToPlugin)

const setNav = () => {
  const isMobile = window.$nuxt.$device.isMobile

  const setNavStyle = window.$nuxt.$store._actions.setNavStyle[0]
  setNavStyle(isMobile)
}

const entering = () => {
  console.log('entering cities')
}

const leaving = () => {
  console.log('leaving cities')
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
  },
  data() {
    return {
      title: 'cities',
    }
  },
  mounted() {
    this.onMount()
  },
  beforeDestroy() {
    this.onDestroy()
  },
  methods: {
    onMount() {
      this.onHeroLoad()

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
