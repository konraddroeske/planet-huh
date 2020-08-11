<template>
  <div>
    <Header />
    <div id="blurrableContent">
      <main>
        <Nuxt />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header'
import Footer from '~/components/Footer'
export default {
  components: { Header, Footer },
}
</script>

<style lang="scss" scoped></style>
