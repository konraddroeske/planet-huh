<template>
  <div id="layout" class="layout">
    <ModalFilters v-if="modal" />
    <Header />
    <div id="blurrableContent">
      <Nav />
      <main id="main" class="main">
        <Nuxt keep-alive />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
export default {
  components: { Header, Nav, Footer },
  computed: mapState({
    modal: (state) => state.categories.modal,
  }),
  mounted() {
    this.$store.commit('setMobile', this.$device.isMobile)
  },
}
</script>

<style lang="scss" scoped>
.main {
  min-height: 100px;
  position: relative;
}
</style>
