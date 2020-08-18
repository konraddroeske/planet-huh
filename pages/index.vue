<template>
  <div>
    <CTA />
    <CategoryNav variant="gradient" />
    <FeaturedCollabs />
    <PostsFeed />
  </div>
</template>

<script>
import CTA from '@/components/CTA'
import FeaturedCollabs from '@/components/FeaturedCollabs'
import CategoryNav from '@/components/CategoryNav'
import PostsFeed from '@/components/PostsFeed'

export default {
  layout: 'default',
  components: {
    CTA,
    FeaturedCollabs,
    CategoryNav,
    PostsFeed,
  },
  async fetch({ store }) {
    await store.dispatch('homepage/getHomepage')
    await store.dispatch('homepage/getSomePosts', 4)
  },
}
</script>

<style></style>
