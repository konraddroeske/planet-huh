<template>
  <div>
    <div class="logoContainer">
      <Logo />
    </div>
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Logo from '~/components/Logo'
import Footer from '~/components/Footer'
export default {
  components: { Logo, Footer },
}
</script>

<style lang="scss" scoped>
.logoContainer {
  position: fixed;
  z-index: $z-above;
  top: 1.5rem;
  left: 2rem;
}
</style>
