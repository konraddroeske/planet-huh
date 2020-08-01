<template>
  <div>
    <Nav />
    <CTA />
    <CategoryNav variant="gradient" />
  </div>
</template>

<script>
import Nav from '@/components/Nav'
import CTA from '@/components/CTA'
import CategoryNav from '@/components/CategoryNav'

export default {
  components: {
    Nav,
    CTA,
    CategoryNav,
  },
  created() {
    this.$store.dispatch('homepage/getHomepage')
  },
}
</script>

<style></style>
