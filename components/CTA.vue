<template>
  <div class="container">
    <Wrapper>
      <h1>{{ title }}</h1>
      <p>
        {{ text }}
      </p>
      <Button to="/about">Learn More</Button>
    </Wrapper>
  </div>
</template>

<script>
import Wrapper from "./Wrapper"
import Button from "./Button"
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
  margin: 0;
  padding: 5rem 0 0 0;

  @media (min-width: $bp-desktop) {
    width: 40%;
    margin: 0 auto 0 auto;
  }
}

h1 {
  text-transform: uppercase;
  font-weight: $extrabold;
  font-size: 3rem;
  margin-top: 0;
}

p {
  margin-bottom: 2rem;
  line-height: 1.2;
}
</style>
