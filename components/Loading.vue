<template lang="html">
  <div v-if="loading" ref="loading" class="loading-page">
    <div ref="logo" class="logoContainer">
      <Logo />
    </div>
  </div>
</template>

<script>
import gsap from "gsap"
import { CSSPlugin } from "gsap/all"
import { mapState } from "vuex"
import Logo from "@/components/Logo"
export default {
  components: {
    Logo,
  },
  computed: {
    ...mapState({
      loading: (state) => state.loading,
    }),
  },
  mounted() {
    gsap.registerPlugin(CSSPlugin)
    this.$store.commit("setFinish", this.finish)
    this.start()
  },
  methods: {
    start() {
      gsap.to(this.$refs.logo, 1.5, {
        autoAlpha: 1,
      })
    },
    finish() {
      gsap.to(this.$refs.loading, 2, {
        autoAlpha: 0,
        onComplete: () => this.$store.commit("setLoading", false),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $white;
  text-align: center;
  z-index: $z-loading;

  display: flex;
  align-items: center;
  justify-content: center;

  .logoContainer {
    display: inline-block;
    opacity: 0;
  }
}
</style>
