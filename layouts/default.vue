<template>
  <div>
    <div class="fixed z-10 pt-6 pl-8">
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

<style lang="scss"></style>
