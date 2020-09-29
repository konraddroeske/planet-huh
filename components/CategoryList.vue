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
import Wrapper from "@/components/Wrapper"
import categoryRouteReset from "~/mixins/categoryRouteReset"
export default {
  components: {
    Wrapper,
  },
  mixins: [categoryRouteReset],
  props: {
    categories: {
      required: true,
      type: Array,
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
  display: grid;
  grid-auto-rows: 1fr;
}

li {
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid $black;

  &:hover {
    border: 1px solid $accent;
  }

  &:hover h2 {
    color: $accent;
  }
}

.categoryButton {
  padding: 2.5rem 1rem 2.5rem 1rem;
  border: none;
  width: 100%;
  height: 100%;
  background-color: transparent;
  cursor: pointer;
  display: flex;
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
  ul {
    grid-template-columns: 1fr 1fr;
    column-gap: 3%;
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
