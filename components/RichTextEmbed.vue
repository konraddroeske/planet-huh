<template>
  <div class="richTextContainer">
    <resize-observer @notify="handleResize()" />
    <iframe
      :id="name"
      class="richTextEmbed"
      :src="url"
      :style="setStyle"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
import Vue from "vue"
import VueResize from "vue-resize"
import "vue-resize/dist/vue-resize.css"
import gsap from "gsap"

Vue.use(VueResize)

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
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    setStyle() {
      return {
        width: this.width,
        height: this.height,
      }
    },
    intWidth() {
      return parseInt(this.width.slice(0, -2))
    },
    intHeight() {
      return parseInt(this.height.slice(0, -2))
    },
    ratio() {
      return this.intHeight / this.intWidth
    },
  },
  activated() {
    this.handleResize()
  },
  methods: {
    handleResize() {
      const container = document.getElementById(this.name)
      const width = container.offsetWidth

      if (width < this.intWidth) {
        gsap.set(`#${this.name}`, {
          height: `${this.ratio * width}px`,
        })
      } else {
        gsap.set(`#${this.name}`, {
          height: this.height,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.richTextContainer {
  display: inline-block;
  position: relative;
  width: 100%;
}

.richTextEmbed {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}
</style>
