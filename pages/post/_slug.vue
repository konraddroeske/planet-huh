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
      :city="{ name: city, filterType: 'exclude' }"
      :sense="{ name: sense, filterType: 'exclude' }"
      :mood="{ name: mood, filterType: 'exclude' }"
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
    title() {
      return this.post?.title
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
    city() {
      return this.post.city[0] ? this.post.city[0].name : ""
    },
    sense() {
      return this.post.sense[0] ? this.post.sense[0].name : ""
    },
    mood() {
      return this.post.mood ? this.post.mood.mood : ""
    },
  },

  activated() {
    this.onMount()
  },
  deactivated() {
    this.onDestroy()
  },

  methods: {
    setData(data, coverImage, content) {
      this.post = {
        ...data.data.post,
        imageSrc: coverImage.url,
        content: content.raw.children,
      }
    },
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
      title: `Planet Huh${this.title ? " | " + this.title : ""}`,
      meta: [
        {
          hid: "og:title",
          property: "og:title",
          content: this.title,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
