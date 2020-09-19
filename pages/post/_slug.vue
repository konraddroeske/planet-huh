<template>
  <div v-if="post">
    <HeroBanner v-if="post.artist.length === 1" v-bind="post" />
    <CollabBanner
      v-if="post.artist.length > 1"
      v-bind="post"
      :headline="'Presented by Red Bull'"
    />
    <RichText :content="post.content" />
    <ArtistCredits :artists="post.artist" />
    <SocialShare :title="post.title" link="" />
    <SuggestedPosts
      :included-cities="cities"
      :included-senses="senses"
      :included-mood="mood"
    />
    <Footer />
  </div>
</template>

<script>
import { mapState } from "vuex"

import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import HeroBanner from "@/components/HeroBanner"
import CollabBanner from "@/components/CollabBanner"
import RichText from "@/components/RichText"
import ArtistCredits from "@/components/ArtistCredits"
import SocialShare from "@/components/SocialShare"
import SuggestedPosts from "@/components/SuggestedPosts"
import Footer from "@/components/Footer"

gsap.registerPlugin(ScrollToPlugin)

export default {
  layout: "default",
  components: {
    HeroBanner,
    CollabBanner,
    RichText,
    ArtistCredits,
    SocialShare,
    SuggestedPosts,
    Footer,
  },
  transition: {
    enter(el, done) {
      this.$store.dispatch("transitions/setEnter", { el, done })
    },
    leave(el, done) {
      this.$store.dispatch("transitions/setLeave", { el, done })
    },
  },
  data() {
    return {
      slug: this.$route.params.slug,
    }
  },
  computed: {
    metaTitle() {
      return this.post?.title.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
        match.toUpperCase()
      )
    },
    ...mapState({
      posts: (state) => state.posts.posts,
    }),
    post() {
      const post = this.posts.find((el) => el.slug === this.slug)
      const { coverImage, content } = post

      return {
        ...post,
        imageSrc: coverImage.url,
        content: content.raw.children,
      }
    },
    cities() {
      return this.post.city.map((city) => city.name)
    },
    senses() {
      return this.post.sense.map((sense) => sense.name)
    },
    mood() {
      return this.post.mood ? this.post.mood.mood : ""
    },
    img() {
      return this.post.imageSrc
    },
    description() {
      return this.post.excerpt
    },
  },

  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },

  methods: {
    onMount() {
      const nav = document.querySelector("#navContainer")
      nav.addEventListener("click", this.route, false)
      nav.addEventListener("touchstart", this.route, false)
    },
    onDestroy() {
      const nav = document.querySelector("#navContainer")
      nav.removeEventListener("click", this.route, false)
      nav.removeEventListener("touchstart", this.route, false)
    },
    route() {
      this.$router.push({
        path: `/`,
      })
    },
  },
  head() {
    return {
      title: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.description,
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.metaTitle,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: this.img,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.description,
        },
        {
          hid: "og:url",
          property: "og:url",
          content: `http://www.planethuh.com/${this.$route.params.slug}`,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: this.metaTitle,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: this.img,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: this.description,
        },
        {
          hid: "twitter:image:alt",
          name: "twitter:image:alt",
          content: this.description,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
