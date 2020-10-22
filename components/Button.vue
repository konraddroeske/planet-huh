<template>
  <nuxt-link v-if="to" :to="to">
    <slot />
  </nuxt-link>

  <button v-else @click="onClick">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      default: null,
    },
  },
  methods: {
    onClick(event) {
      this.$emit("clicked")
    },
  },
}
</script>

<style lang="scss" scoped>
a,
a:visited {
  display: inline-block;
  color: $black;
  text-decoration: none;
  border: 2px solid $accent;
  border-radius: 180px;
  padding: 1rem 2.5rem;
  background: transparent;
  text-transform: uppercase;
  font-weight: $semibold;
  font-size: 1.25rem;

  &:hover,
  &:focus {
    color: $white;
    background: $accent;
  }
}

button {
  border: 2px solid #749bff;
  border-radius: 180px;
  padding: 1rem 1.5rem;
  background: transparent;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 1rem;

  &:hover,
  &:focus {
    color: $white;
    background: $accent;
  }
}

@media (min-width: $bp-tablet) {
  button {
    padding: 1rem 2.5rem;
    /* font-size: 1.25rem; */
  }
}
</style>
