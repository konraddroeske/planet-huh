<template>
  <div class="container">
    <Wrapper>
      <h1>{{ title }}</h1>
      <p>
        {{ text }}
      </p>
      <Button :to="{ name: 'cities' }">Learn More</Button>
    </Wrapper>
  </div>
</template>

<script>
import Wrapper from './Wrapper'
import Button from './Button'
export default {
  components: { Wrapper, Button },
  computed: {
    title() {
      return this.$store.state.homepage.ctaTitle
    },
    text() {
      return this.$store.state.homepage.ctaText
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  text-align: center;
  margin: 5rem 0;

  @media (min-width: $bp-desktop) {
    width: 40%;
    margin: 5rem auto;
  }
}

h1 {
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 3rem;
}

p {
  margin-bottom: 2rem;
}
</style>
