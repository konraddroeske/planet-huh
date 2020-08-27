<template>
  <button class="arrow" @click="onClick"><slot /></button>
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
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;

  width: 2rem;
  svg {
    width: 2rem;
    height: 2rem;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: $bp-tablet) {
    width: 3rem;

    svg {
      width: 3rem;
      height: 3rem;
    }
  }

  @media (min-width: $bp-desktop) {
    width: 4rem;

    svg {
      width: 4rem;
      height: 4rem;
    }
  }
}
</style>
