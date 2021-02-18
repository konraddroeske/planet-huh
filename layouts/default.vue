<template>
  <div id="layout" ref="layout" class="layout">
    <Loading />
    <ModalFilters v-if="modal" />
    <Header />
    <div id="blurrableContent" class="burrableContent">
      <Nav />
      <main id="main" class="main">
        <Nuxt keep-alive />
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Header from "@/components/Header"
import Nav from "@/components/Nav"
import Loading from "@/components/Loading"

export default {
  components: { Header, Nav, Loading },
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
.layout {
  position: relative;
}

.burrableContent {
  position: relative;
}

.main {
  min-height: 100px;
  position: relative;
  transform: translateY(100vh);
}
</style>
