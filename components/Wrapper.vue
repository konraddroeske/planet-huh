<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 85%;
  margin: 0 auto;

  @media (min-width: $bp-desktop) {
    width: 85%;
  }
}
</style>
