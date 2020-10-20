<template>
  <v-lazy-image
    v-if="src"
    :src="computedSrc"
    :src-placeholder="srcPlaceholder"
    :alt="alt"
    @load="onLoaded"
  />
  <v-lazy-image v-else src="replaceMe.jpg" alt="Replace me." @load="onLoaded" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
      // default: "replaceMe.jpg",
    },
    alt: {
      type: String,
      default: "",
    },
    maxWidth: {
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
      if (!this.$props.maxWidth) return this.$props.src
      return this.resizeImageSrc(this.$props.maxWidth)
    },
    srcPlaceholder() {
      return this.resizeImageSrc(this.$props.placeholderWidth)
    },
  },
  methods: {
    onLoaded(event) {
      this.$emit("loaded")
    },
    removeTrailingSlash(str) {
      return str.replace(/\/$/, "")
    },
    splitBySlash(str) {
      const split = [...str.split("/")]
      const arr = [split.splice(0, 3).join("/")]

      for (let i = 0; i < split.length; i++) {
        arr.push(split[i])
      }

      return arr
    },
    joinBySlash(...args) {
      return args.join("/")
    },
    resizeImageSrc(width) {
      const src = this.$props.src.trim()

      const resizeQuery = "resize="
      const idealResize = `${resizeQuery}fit:max,width:${width}`

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
