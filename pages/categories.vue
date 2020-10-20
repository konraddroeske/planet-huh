<template>
  <div>
    <div class="categories">
      <CategoryHero :title="title" />
      <FeaturedCollabs v-if="cityCollabs.length > 0" :posts="cityCollabs" />
      <CityCurators v-if="cityCurators.length > 0" :artists="cityCurators" />
      <CategoryList v-if="isParentCategory" :categories="categories" />
      <CategoryEmpty v-if="postsTotal.length === 0 && !isFetching" />
      <PostsFeed
        :posts="postsTotal"
        :post-limit="postLimit"
        get-some-posts-path="categories/getCategoryPosts"
      />
    </div>
    <Footer />
  </div>
</template>

<script>
import isEmpty from "lodash.isempty"
import { mapState } from "vuex"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import CategoryHero from "@/components/CategoryHero"
import FeaturedCollabs from "@/components/FeaturedCollabs"
import CityCurators from "@/components/CityCurators"
import CategoryList from "@/components/CategoryList"
import CategoryEmpty from "@/components/CategoryEmpty"
import PostsFeed from "@/components/PostsFeed"
import Footer from "@/components/Footer"

gsap.registerPlugin(ScrollToPlugin)

export default {
  layout: "default",
  transition: {
    enter(el, done) {
      this.$store.dispatch("transitions/setEnter", { el, done })
      this.$store.dispatch("transitions/setNavContainerSmall")
    },
    leave(el, done) {
      this.$store.dispatch("transitions/setLeave", { el, done })
    },
  },
  components: {
    CategoryHero,
    FeaturedCollabs,
    PostsFeed,
    CityCurators,
    CategoryList,
    CategoryEmpty,
    Footer,
  },
  data() {
    return {
      from: null,
    }
  },
  computed: {
    ...mapState({
      title: (state) => state.categories.title,
      postLimit() {
        return this.$store.getters["categories/postLimit"]
      },
      postsTotal() {
        return this.$store.getters["categories/postsTotal"]
      },
      allFilters: (state) => state.categories.allFilters,
      isFetching: (state) => state.categories.isFetching,
      collabs: (state) => state.posts.collabs,
      artists: (state) => state.categories.artists,
    }),
    metaTitle() {
      return this.title.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
        match.toUpperCase()
      )
    },
    isParentCategory() {
      if (this.title) {
        return this.allFilters[this.title]?.hasParent === false
      }

      return false
    },
    categories() {
      if (this.isParentCategory) {
        return [...this.$store.state.categories[this.title]]
          .sort((a, b) => b.post.length - a.post.length)
          .slice(0, 6)
          .map((item) => {
            return this.title === "moods" ? item.mood : item.name
          })
      }

      return null
    },
    cityCollabs() {
      return this.collabs.filter((collab) => {
        if (
          collab.city[0].name.toLowerCase() === this.title ||
          collab.city[1].name.toLowerCase() === this.title
        ) {
          return collab
        }
      })
    },
    cityCurators() {
      return this.artists.filter((artist) => {
        if (artist.location.toLowerCase() === this.title) {
          return artist
        }
      })
    },
  },
  watch: {
    $route(to, from) {
      if (to.name === "categories") {
        this.$store.dispatch(
          "categories/handleRouteQueries",
          isEmpty(to.query.filters) ? {} : to.query.filters
        )
      }
    },
  },
  activated() {
    this.$store.dispatch(
      "categories/handleRouteQueries",
      isEmpty(this.$route.query) ? {} : this.$route.query
    )

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
    route() {
      this.$router.push({
        path: `/`,
      })
    },
  },
  head() {
    return {
      title: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
      meta: [
        {
          hid: "og:title",
          property: "og:title",
          content: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
        },
        {
          hid: "og:site_name",
          property: "og:site_name",
          content: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `http://www.planethuh.com${this.$route.fullPath}`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
