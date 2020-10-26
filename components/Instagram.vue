<script>
export default {
  props: {
    url: {
      type: String,
      default: null,
    },
    maxWidth: {
      type: Number,
      default: 320,
    },
    hideCaption: {
      type: Boolean,
      default: false,
    },
    omitScript: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      html: "",
    }
  },
  mounted() {
    if (window.FB) {
      this.fetchEmbed()
    }
  },
  methods: {
    fetchEmbed() {
      this.validateUrl()
      const maxWidth = this.maxWidth >= 320 ? this.maxWidth : 320

      window.FB.api(
        "/instagram_oembed",
        "GET",
        {
          url: this.url,
          access_token: "392644721931229|376f83040d9f0ca2b9f7b5655017d33d",
          maxwidth: maxWidth,
          hidecaption: this.hideCaption,
          omitscript: this.omitScript,
        },
        (response) => {
          this.html = response.html
          this.$nextTick(() => {
            window.instgrm.Embeds.process()
          })
        }
      )
    },
    validateUrl() {
      const urlRe = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
      if (!urlRe.test(this.url)) {
        throw new Error(`${this.url} - Invalid url`)
      }
    },
  },
  render() {
    return <div class={this.className} domPropsInnerHTML={this.html}></div>
  },
}
</script>

<style lang="scss" scoped></style>
