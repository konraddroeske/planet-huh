<template>
  <div id="layout" class="layout gradients">
    <main id="main" class="main">
      <Nuxt keep-alive />
    </main>
  </div>
</template>

<script>
import gsap from "gsap"
export default {
  mounted() {
    const tl = gsap.timeline({ repeat: -1 })

    tl.set(".gradients", {
      background: `radial-gradient(circle at 85% -30%, #749bff, transparent 20%),
    radial-gradient(circle at 15% 130%, #749bff, transparent 55%)`,
    })
      .to(".gradients", 9, {
        background: `radial-gradient(circle at 75% -30%, #749bff, transparent 65%),
    radial-gradient(circle at 35% 130%, #749bff, transparent 25%)`,
      })
      .to(".gradients", 9, {
        background: `radial-gradient(circle at 85% -30%, #749bff, transparent 20%),
    radial-gradient(circle at 15% 130%, #749bff, transparent 55%)`,
      })
  },
}
</script>

<style lang="scss" scoped>
.gradients {
  background-size: 150% 150%;
  background-position: center;
}

@keyframes my-gradient {
}
</style>
