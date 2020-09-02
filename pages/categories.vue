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
import isEmpty from "lodash.isempty"
import { mapState } from "vuex"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import CategoryHero from "@/components/CategoryHero"
import PostsFeed from "@/components/PostsFeed"

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
  // console.log("leaving")
}

const leavingToIndex = () => {
  const setNavContainerLarge =
    window.$nuxt.$store._actions.setNavContainerLarge[0]
  setNavContainerLarge()

  const setNavLarge = window.$nuxt.$store._actions.setNavLarge[0]
  setNavLarge()
}

export default {
  layout: "default",
  transition: {
    enter(el, done) {
      this.$store.dispatch("setEnter", { el, done })
    },
    leave(el, done) {
      this.$store.dispatch("setLeave", { el, done })
    },
  },
  components: {
    CategoryHero,
    PostsFeed,
  },
  data() {
    return {
      from: null,
    }
  },
  computed: mapState({
    title: (state) => state.categories.title,
    posts: (state) => {
      return state.categories.postsFeed
    },
  }),
  // beforeDestroy() {
  //   this.onDestroy()
  // },
  watch: {
    $route(to, from) {
      if (from.path === "/") {
        entering()
      }

      if (to.path === "/") leavingToIndex()

      if (to.name === "categories") {
        this.$store.dispatch(
          "categories/handleRouteQueries",
          isEmpty(to.query.filters) ? {} : to.query.filters
        )
      }
    },
  },
  mounted() {
    if (!this.$store.state.isMounted) {
      setNav()
      this.$store.commit("toggleMounted")
    }
  },
  activated() {
    this.$store.dispatch(
      "categories/handleRouteQueries",
      isEmpty(this.$route.query) ? {} : this.$route.query
    )

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
      const nav = document.querySelector("#navContainer")
      nav.addEventListener("click", this.route, false)
      nav.addEventListener("touchstart", this.route, false)
    },
    onDestroy() {
      const nav = document.querySelector("#navContainer")
      nav.removeEventListener("click", this.route, false)
      nav.removeEventListener("touchstart", this.route, false)
    },
    onHeroLoad() {
      this.$store.dispatch("setNavContainerSmall")
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
