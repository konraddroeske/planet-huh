<template>
  <div v-if="post">
    <HeroBanner v-if="post" v-bind="post" :city="'Toronto'" />
    <RichText v-if="post" :content="post.content" />
    <SocialShare v-if="post" :title="post.title" :link="link" />
  </div>
</template>

<script>
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
import RichText from '@/components/RichText'
import SocialShare from '@/components/SocialShare'
export default {
  layout: 'post',
  components: { HeroBanner, RichText, SocialShare },
  data() {
    return {
      slug: this.$route.params.slug,
      post: null,
    }
  },
  computed: {
    link() {
      const host = this.req ? this.req.headers.host : window.location.origin
      return `${host}${this.$route.path}`
    },
  },
  async created() {
    const { data } = await fetchContent(`{
      post(where: {slug: "${this.slug}"}) {
        content {
          html
          markdown
          raw
          text
        }
        coverImage {
          url
        }
        date
        excerpt
        mood
        sense
        title
      }
    }`)

    this.post = {
      ...data.data.post,
      imageSrc: data.data.post.coverImage.url,
      content: data.data.post.content.raw.children,
    }
  },
}
</script>

<style lang="scss" scoped></style>
