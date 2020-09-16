<template>
  <div id="layout" class="layout">
    <ModalFilters v-if="modal" />
    <Header />
    <div id="blurrableContent" class="burrableContent">
      <Nav />
      <main id="main" class="main">
        <Nuxt keep-alive />
        <!-- <Footer /> -->
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Header from "@/components/Header"
// import Footer from "@/components/Footer"
import Nav from "@/components/Nav"
export default {
  components: { Header, Nav },
  computed: {
    ...mapState({
      modal: (state) => state.categories.modal,
    }),
    isMobile() {
      return this.$device.isMobileOrTablet
    },
  },
  mounted() {
    this.$store.commit("transitions/setMobile", this.isMobile)
  },
}
</script>

<style lang="scss" scoped>
.burrableContent {
  position: relative;
}

.main {
  min-height: 100px;
  position: relative;
  transform: translateY(100vh);
}
</style>
