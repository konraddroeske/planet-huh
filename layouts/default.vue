<template>
  <div>
    <div class="fixed z-10 pt-6 pl-8">
      <Logo />
    </div>
    <Nuxt />
  </div>
</template>

<script>
import Logo from '~/components/Logo'
export default {
  components: { Logo },
}
</script>

<style lang="scss"></style>
