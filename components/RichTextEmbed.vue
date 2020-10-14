<template>
  <div class="richTextContainer">
    <resize-observer @notify="handleResize()" />
    <iframe
      v-if="!instagram"
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
    instagram: {
      type: Boolean,
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
    newWidth() {
      return parseInt(this.width.slice(0, -2))
    },
    newHeight() {
      return parseInt(this.height.slice(0, -2))
    },
    ratio() {
      return this.newHeight / this.newWidth
    },
  },

  methods: {
    handleResize() {
      const container = document.getElementById(this.name)
      const width = container.offsetWidth
      let extra = 1

      if (this.instagram) {
        extra = 1.1
      }

      if (width < this.newWidth) {
        gsap.set(`#${this.name}`, {
          height: `${this.ratio * width * extra}px`,
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
}

.richTextEmbed {
  max-width: 100%;
}
</style>
