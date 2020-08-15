<template>
  <div class="layout">
    <Header />
    <div id="blurrableContent">
      <main class="main">
        <Nuxt />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  components: { Header, Footer },
}
</script>

<style lang="scss" scoped>
.main {
  z-index: $z-above;
  position: relative;
}
</style>
