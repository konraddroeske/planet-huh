<template>
<<<<<<< HEAD
  <div>
    <HeroBanner v-if="post" v-bind="post" :city="'Toronto'" />
    <RichText v-if="post" :content="post.content" />
  </div>
=======
  <HeroBanner v-bind="post" :city="'Toronto'" />
>>>>>>> master
</template>

<script>
import { fetchContent } from '@/utils/api'
import HeroBanner from '@/components/HeroBanner'
<<<<<<< HEAD
import RichText from '@/components/RichText'
export default {
  layout: 'post',
  components: { HeroBanner, RichText },
  data() {
    return {
      slug: this.$route.params.slug,
      post: null,
=======
export default {
  layout: 'post',
  components: { HeroBanner },
  data() {
    return {
      slug: this.$route.params.slug,
      post: {},
>>>>>>> master
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
<<<<<<< HEAD
      content: data.data.post.content.raw.children,
=======
>>>>>>> master
    }
  },
}
</script>

<style lang="scss" scoped></style>
