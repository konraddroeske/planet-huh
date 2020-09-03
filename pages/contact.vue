<template>
  <div class="contact"></div>
</template>

<script>
import { fetchContent } from "@/utils/api"

export default {
  layout: "default",
  async fetch({ store }) {
    const { data } = await fetchContent(``)
  },
  transition: {
    enter(el, done) {
      this.$store.dispatch("setEnter", { el, done })
    },
    leave(el, done) {
      this.$store.dispatch("setLeave", { el, done })
    },
  },
}
</script>

<style lang="scss" scoped></style>
