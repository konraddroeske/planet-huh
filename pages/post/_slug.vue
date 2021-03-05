<template>
  <div v-if="post">
    <HeroBanner v-if="post.artist.length === 1" v-bind="post" />
    <CollabBanner
      v-if="post.artist.length > 1"
      v-bind="post"
      :headline="post.headline"
    />
    <RichText :content="post.content" />
    <ArtistCredits :artists="post.artist" />
    <SocialShare :title="post.title" :link="link" />
    <SuggestedPosts
      :included-cities="cities"
      :included-senses="senses"
      :included-mood="mood"
    />
    <Footer />
  </div>
</template>

<script>
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import HeroBanner from "@/components/HeroBanner"
import CollabBanner from "@/components/CollabBanner"
import RichText from "@/components/RichText"
import ArtistCredits from "@/components/ArtistCredits"
import SocialShare from "@/components/SocialShare"
import SuggestedPosts from "@/components/SuggestedPosts"
import Footer from "@/components/Footer"
import transitions from "@/mixins/transitions"
import { fetchContent } from "../../utils/api"

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
  mixins: [transitions],
  async fetch() {
    try {
      const { data } = await fetchContent(`{
        post(where: {slug: "${this.$route.params.slug}"}) {
          id
            title
            headline
            slug
            blueTitle
            curated
            excerpt
            date
            featured
            featuredImages {
              id
              url
              fileName
            }
            content {
                html
                markdown
                raw
                text
            }
            coverImage {
                url
            }
            sense {
                name
            }
            mood {
                moodCategory
                mood
            }
            artist {
                name
                city {
                  name
                }
                about
                website
                social
                socialUrl
            }
            city {
                name
            }
        }
      }`)

      const { post } = data.data
      const { coverImage, content } = post

      this.post = {
        ...post,
        imageSrc: coverImage.url,
        content: content.raw.children,
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  },
  fetchOnServer: true,
  data() {
    return {
      post: null,
      slug: this.$route.params.slug,
      link: `http://www.planethuh.com${this.$route.fullPath}/`,
    }
  },
  computed: {
    metaTitle() {
      return this.post?.title.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
        match.toUpperCase()
      )
    },
    // ...mapState({
    //   posts: (state) => state.posts.posts,
    // }),
    // post() {
    //   const post = this.posts.find((el) => el.slug === this.slug)
    //   const { coverImage, content } = post
    //
    //   return {
    //     ...post,
    //     imageSrc: coverImage.url,
    //     content: content.raw.children,
    //   }
    // },
    cities() {
      return this.post && this.post.city.map((city) => city.name)
    },
    senses() {
      return this.post && this.post.sense.map((sense) => sense.name)
    },
    mood() {
      return this.post && this.post.mood ? this.post.mood.mood : ""
    },
    img() {
      return this.post && this.post.imageSrc
    },
    description() {
      return this.post && this.post.excerpt
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
          content: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
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
          content: this.link,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
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
        {
          hid: "og:site_name",
          property: "og:site_name",
          content: `Planet Huh${this.metaTitle ? " | " + this.metaTitle : ""}`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
