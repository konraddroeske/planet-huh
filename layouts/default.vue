<template>
  <div id="layout" class="layout">
    <Header />
    <div id="blurrableContent">
      <Nav />
      <main id="main" class="main">
        <Nuxt />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
export default {
  components: { Header, Nav, Footer },
}
</script>

<style lang="scss" scoped>
.main {
  min-height: 100px;
  position: relative;
}
</style>
