<template>
  <Wrapper>
    <ul>
      <li v-for="(category, index) in categories" :key="index">
        <button class="categoryButton" @click="routeFilter(category)">
          <h2>
            {{ category }}
          </h2>
        </button>
      </li>
    </ul>
  </Wrapper>
</template>

<script>
import { mapActions, mapMutations } from "vuex"
import gsap from "gsap"
import Wrapper from "@/components/Wrapper"
export default {
  components: {
    Wrapper,
  },
  props: {
    categories: {
      required: true,
      type: Array,
    },
  },
  methods: {
    ...mapActions({
      getQueries: "categories/getQueries",
    }),
    ...mapMutations({
      resetFilters: "categories/resetFilters",
    }),
    async routeFilter(filter) {
      this.resetFilters()
      gsap.to(window, 0.4, {
        scrollTo: 0,
        ease: "power4.out",
      })

      let queries = []
      filter ? (queries = await this.getQueries(filter)) : (queries = [])

      this.$router.push({
        path: "/categories",
        query: { filters: queries },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

li {
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid $black;
}

// li:last-child {
//   margin-bottom: 0;
// }

.categoryButton {
  padding: 2rem 1rem 2rem 1rem;
  border: none;
  width: 100%;
  background-color: transparent;
  cursor: pointer;
}

h2 {
  font-family: $font-display;
  margin: 0;
  font-size: 9vw;
  text-align: left;
  text-transform: uppercase;
  font-weight: $extrabold;
  line-height: 0.9;
}

@media (min-width: $bp-tablet) {
  li {
    width: calc(50% - 1.5%);
  }

  h2 {
    font-size: 5vw;
  }
}

@media (min-width: $bp-desktop) {
  .categoryButton {
    padding: 2.5rem 1.5rem 2.5rem 1.5rem;
  }
}

@media (min-width: $bp-lg-desktop) {
  h2 {
    font-size: 4rem;
  }
}
</style>
