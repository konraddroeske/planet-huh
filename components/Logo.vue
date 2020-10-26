<template>
  <nuxt-link :to="link" class="logo">
    <Logo />
  </nuxt-link>
</template>

<script>
import Logo from "~/assets/icons/logo.svg?inline"

export default {
  components: {
    Logo,
  },
  props: {
    link: {
      type: String,
      required: false,
      default: "/",
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  display: block;
}

.logo {
  width: 40px;
}
</style>
