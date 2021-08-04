<template>
  <div id="layout" ref="layout" class="layout">
    <div v-if="saved === null">
      <MoodSubmission />
    </div>
    <div v-else>
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
  </div>
</template>

<script>
import { mapState } from "vuex"
import Vue from "vue"

import VueCookies from "vue-cookies"
import Header from "@/components/Header"
import Nav from "@/components/Nav"
import Loading from "@/components/Loading"
import MoodSubmission from "@/components/MoodSubmission"

Vue.use(VueCookies)

export default {
  components: {
    Header,
    Nav,
    Loading,
    MoodSubmission,
  },

  computed: {
    ...mapState({
      modal: (state) => state.categories.modal,
      saved: (state) => state.saved,
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
