<template>
  <div id="layout" class="layout gradients">
    <main id="main" class="main">
      <Nuxt keep-alive />
    </main>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.gradients {
  background: radial-gradient(circle at 80% top, #749bff, transparent 60%),
    radial-gradient(circle at 20% bottom, #749bff, transparent 60%);
  background-size: 150% 150%;
}

@keyframes my-gradient {
}
</style>
