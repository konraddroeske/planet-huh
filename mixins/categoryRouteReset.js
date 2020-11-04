import gsap from "gsap"
import { mapMutations, mapActions } from "vuex"

export default {
  methods: {
    ...mapMutations({
      resetFilters: "categories/resetFilters",
    }),
    ...mapActions({
      getQueriesSearch: "categories/getQueriesSearch",
    }),
    async routeFilter(filter) {
      this.resetFilters()

      gsap.to(window, {
        duration: 0.4,
        scrollTo: 0,
        ease: "power4.out",
      })

      let queries = []
      filter ? (queries = await this.getQueriesSearch(filter)) : (queries = [])

      this.$router.push({
        path: "/categories",
        query: { filters: queries },
      })
    },
  },
}
