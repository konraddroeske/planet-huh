<template>
  <section class="featuredCollabs">
    <h2 class="title">Featured Collabs</h2>
    <ul class="collabsList">
      <li v-for="post of formattedPosts" :key="post.id" class="collab">
        <div class="leftImage"></div>
        <div class="rightImage"></div>
        <div class="content">
          <div class="headline"></div>
          <div class="title"></div>
          <Button></Button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import Button from '@/components/Button'

export default {
  components: {
    Button,
  },
  computed: {
    ...mapState({
      posts: (state) => state.homepage.featuredCollabPosts,
    }),
    formattedPosts() {
      return this.posts.map((post) => ({
        ...post,
        date: moment(post.date).format('MMMM D, YYYY'),
      }))
    },
  },
  mounted() {
    console.log(this.formattedPosts)
  },
}
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
}
</style>
