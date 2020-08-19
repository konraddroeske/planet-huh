<template>
  <div>
    <HeroBanner v-if="post" v-bind="post" :city="'Toronto'" />
    <RichText v-if="post" :content="post.content" />
  </div>
</template>

<script>
import gsap from 'gsap'
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
import RichText from '@/components/RichText'
export default {
  layout: 'default',
  // transition: {
  //   css: false,
  //   mode: 'out-in',
  // },
  components: { HeroBanner, RichText },
  data() {
    return {
      slug: this.$route.params.slug,
      post: null,
    }
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
