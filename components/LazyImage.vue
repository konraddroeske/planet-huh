<template>
  <v-lazy-image :src="computedSrc" :src-placeholder="srcPlaceholder" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
    imageWidth: {
      type: Number,
      default: null,
    },
    placeholderWidth: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    computedSrc() {
      if (!this.$props.imageWidth) return this.$props.src
      return this.resizeImageSrc(this.$props.imageWidth)
    },
    srcPlaceholder() {
      return this.resizeImageSrc(this.$props.placeholderWidth)
    },
  },
  methods: {
    removeTrailingSlash(str) {
      return str.replace(/\/$/, "")
    },
    splitBySlash(str) {
      return str.split(/(?<!\/)\/(?!\/)/)
    },
    joinBySlash(...args) {
      return args.join("/")
    },
    resizeImageSrc(width) {
      const src = this.$props.src.trim()

      const resizeQuery = "resize="
      const idealResize = `${resizeQuery}width:${width}`

      const { splitBySlash, joinBySlash, removeTrailingSlash } = this

      if (src.includes(resizeQuery)) {
        const [root, , output, id] = splitBySlash(src)
        return removeTrailingSlash(joinBySlash(root, idealResize, output, id))
      } else {
        const [root, output, id] = splitBySlash(src)
        return removeTrailingSlash(joinBySlash(root, idealResize, output, id))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-lazy-image {
  filter: blur(5px);
  transition: filter 1s;
  will-change: filter;
}

.v-lazy-image-loaded {
  filter: blur(0);
}
</style>
