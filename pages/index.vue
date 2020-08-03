<template>
  <div>
    <Nav />
    <CTA />
    <FeaturedCollabs />
    <CategoryNav variant="gradient" />
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import CTA from '@/components/CTA'
import FeaturedCollabs from '@/components/FeaturedCollabs'
import CategoryNav from '@/components/CategoryNav'

export default {
  components: {
    Nav,
    CTA,
    FeaturedCollabs,
    CategoryNav,
  },
  created() {
    this.$store.dispatch('homepage/getHomepage')
  },
}
</script>

<style></style>
