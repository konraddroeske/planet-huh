<template>
  <div>
    <Nav />
    <!-- <NavTest /> -->
    <CTA :title="ctaTitle" :text="ctaText" />
    <CategoryNav variant="gradient" />
  </div>
</template>

<script>
import axios from 'axios'
import Nav from '@/components/Nav'
import CTA from '@/components/CTA'
import CategoryNav from '@/components/CategoryNav'
// import NavTest from '@/components/NavTest'

export default {
  components: {
    Nav,
    // NavTest,
    CTA,
    CategoryNav,
  },
  data() {
    return {
      ctaTitle: '',
      ctaText: '',
      featuredPost: undefined,
    }
  },
  async mounted() {
    const { data } = await axios({
      method: 'post',
      url:
        'https://api-us-east-1.graphcms.com/v2/ckcmojoyd1vly01xo5ubkgptp/master',
      data: {
        query: `{
          homePages {
            ctaTitle
            ctaText
            featuredPost {
              title
              date
              slug
            }
          }
        }`,
      },
    })

    const { ctaTitle, ctaText, featuredPost } = data.data.homePages[0]
    this.ctaTitle = ctaTitle
    this.ctaText = ctaText
    this.featuredPost = featuredPost
  },
}
</script>

<style></style>
