<template>
  <div class="layout">
    <Header />
    <Nav />
    <main class="main">
      <Nuxt />
    </main>
    <Footer />
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
.layout {
  position: relative;
}

.main {
  padding-top: 100vh;
}
</style>
