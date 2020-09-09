<template>
  <Wrapper>
    <div class="categoryEmpty">
      <h2>Oops!</h2>
      <p>
        No results found. Try using different keywords or reducing the number of
        filters in your search.
      </p>
    </div>
  </Wrapper>
</template>

<script>
import Wrapper from "@/components/wrapper"

export default {
  components: {
    Wrapper,
  },
}
</script>

<style lang="scss" scoped>
.categoryEmpty {
  margin: 0 auto;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h2 {
  font-size: 4rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

p {
  text-align: center;
}

@media (min-width: $bp-tablet) {
  h2 {
    font-size: 5rem;
  }
}
</style>
