<template>
  <div>
    <Nav />
    <CTA />
    <CategoryNav variant="gradient" />
    <PostsFeed
      :posts="postsFeed"
      :get-some-posts="() => this.$store.dispatch('homepage/getSomePosts', 4)"
    />
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import CTA from '@/components/CTA'
import CategoryNav from '@/components/CategoryNav'
import PostsFeed from '@/components/PostsFeed'

export default {
  components: {
    Nav,
    CTA,
    CategoryNav,
    PostsFeed,
  },
  computed: {
    postsFeed() {
      return this.$store.state.homepage.postsFeed
    },
  },
  created() {
    this.$store.dispatch('homepage/getHomepage')
  },
}
</script>

<style></style>
