<template>
  <HeroBanner v-bind="post" :city="'Toronto'" />
</template>

<script>
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
export default {
  layout: 'post',
  components: { HeroBanner },
  data() {
    return {
      slug: this.$route.params.slug,
      post: {},
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
    }
  },
}
</script>

<style lang="scss" scoped></style>
