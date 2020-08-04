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

  width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
