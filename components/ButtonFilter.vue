<template>
  <button class="buttonFilter" @click="onClick"><slot /></button>
</template>

<script>
export default {
  methods: {
    onClick(event) {
      this.$emit('clicked')
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  border: 2px solid $black;
  border-radius: 180px;
  padding: 0.75rem 1.25rem;
  background: $black;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: $medium;
  font-size: $font-sm;
  color: $white;

  &:hover,
  &:focus {
    background: $accent;
  }
}
</style>
