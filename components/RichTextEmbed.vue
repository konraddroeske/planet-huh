<template>
  <iframe
    class="richTextEmbed"
    :src="url"
    :style="setStyle"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: false,
      default: "100%",
    },
    height: {
      type: String,
      required: false,
      default: "100%",
    },
  },
  computed: {
    setStyle() {
      return {
        width: this.width,
        height: this.height,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.richTextEmbed {
  max-width: 100%;
}
</style>
