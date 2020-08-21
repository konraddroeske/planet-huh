<template>
  <button class="downArrow" @click="onClick">
    <slot />
    <!-- <DownArrow /> -->
  </button>
</template>

<script>
// import DownArrow from '~/assets/icons/downArrow.svg?inline'

export default {
  components: {
    // DownArrow,
  },
  methods: {
    onClick(event) {
      this.$emit('clicked')
    },
  },
}
</script>

<style lang="scss" scoped>
.downArrow {
  border: none;
  background-color: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  font-weight: $medium;
  text-decoration: underline;

  //   svg {
  //     width: 2.5rem;
  //     height: 2.5rem;
  //   }
}
</style>
