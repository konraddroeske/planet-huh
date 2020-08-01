<template>
  <nuxt-link v-if="to" :to="to" tab-index="-1">
    <button>
      <slot />
    </button>
  </nuxt-link>

  <button v-else>
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
}
</script>

<style lang="scss" scoped>
a,
a:visited {
  color: $black;

  &:hover,
  &:focus {
    color: $black;
  }
}

button {
  border: 2px solid $accent;
  border-radius: 180px;
  padding: 1rem 2.5rem;
  background: transparent;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: $semibold;
  font-size: 1.25rem;

  &:hover,
  &:focus {
    color: $white;
    background: $accent;
  }
}
</style>
